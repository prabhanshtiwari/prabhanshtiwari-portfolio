(() => {
  'use strict';
  const config = window.PORTFOLIO_CONFIG || {};
  const username = config.githubUsername || 'prabhanshtiwari';
  const cards = [...document.querySelectorAll('[data-github-repo]')];
  const activityList = document.querySelector('[data-github-activity]');
  if (!cards.length && !activityList) return;

  const cacheKey = 'pt-github-public-v1';
  const cacheMaxAge = 30 * 60 * 1000;
  const safeReadCache = () => {
    try {
      const value = JSON.parse(localStorage.getItem(cacheKey) || 'null');
      return value && Date.now() - value.savedAt < cacheMaxAge ? value.data : null;
    } catch (_) { return null; }
  };
  const safeWriteCache = data => {
    try { localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data })); } catch (_) { /* optional cache */ }
  };
  const setText = (node, value) => { if (node) node.textContent = value; };
  const dateLabel = value => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const eventDescription = event => {
    const repo = event.repo?.name || 'a repository';
    const payload = event.payload || {};
    switch (event.type) {
      case 'PushEvent': {
        const count = Array.isArray(payload.commits) ? payload.commits.length : 1;
        const branch = String(payload.ref || '').replace('refs/heads/', '');
        return `Pushed ${count} commit${count === 1 ? '' : 's'}${branch ? ` to ${branch}` : ''} in ${repo}`;
      }
      case 'CreateEvent': return `Created ${payload.ref_type || 'a resource'}${payload.ref ? ` ${payload.ref}` : ''} in ${repo}`;
      case 'PullRequestEvent': return `${payload.action || 'Updated'} a pull request in ${repo}`;
      case 'IssuesEvent': return `${payload.action || 'Updated'} an issue in ${repo}`;
      case 'IssueCommentEvent': return `Commented on an issue or pull request in ${repo}`;
      case 'ReleaseEvent': return `Published a release in ${repo}`;
      case 'ForkEvent': return `Forked ${repo}`;
      case 'WatchEvent': return `Starred ${repo}`;
      case 'PublicEvent': return `Made ${repo} public`;
      case 'DeleteEvent': return `Deleted a ${payload.ref_type || 'reference'} in ${repo}`;
      default: return '';
    }
  };
  const renderEvents = events => {
    if (!activityList) return;
    const items = (Array.isArray(events) ? events : []).filter(event => eventDescription(event)).slice(0, 6);
    activityList.replaceChildren();
    if (!items.length) {
      const item = document.createElement('li');
      item.className = 'github-activity-empty';
      item.textContent = 'No recent public events are available from GitHub right now. The full profile may show additional contribution history.';
      activityList.append(item);
      setText(document.querySelector('[data-github-activity-state]'), 'No recent events');
      return;
    }
    items.forEach(event => {
      const item = document.createElement('li');
      item.className = 'github-activity-item';
      const marker = document.createElement('span');
      marker.className = 'github-activity-marker';
      marker.setAttribute('aria-hidden', 'true');
      const copy = document.createElement('div');
      const description = document.createElement('p');
      description.textContent = eventDescription(event);
      const meta = document.createElement('span');
      meta.textContent = `${event.type.replace('Event', '')} · ${dateLabel(event.created_at)}`;
      copy.append(description, meta);
      item.append(marker, copy);
      activityList.append(item);
    });
    setText(document.querySelector('[data-github-activity-state]'), 'Recent activity');
    setText(document.querySelector('[data-github-activity-updated]'), `Updated ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
  };
  const applyRepos = (repos, publicRepoCount = null) => {
    if (Array.isArray(repos)) {
      setText(document.querySelector('[data-github-repo-count]'), String(publicRepoCount ?? repos.length));
    } else if (publicRepoCount != null) {
      setText(document.querySelector('[data-github-repo-count]'), String(publicRepoCount));
    }
    if (!Array.isArray(repos)) return;
    const byName = new Map(repos.map(repo => [String(repo.name).toLowerCase(), repo]));
    cards.forEach(card => {
      const repo = byName.get(String(card.dataset.githubRepo || '').toLowerCase());
      if (!repo) {
        setText(card.querySelector('[data-repo-stars]'), 'Repository details unavailable');
        return;
      }
      setText(card.querySelector('[data-repo-language]'), repo.language || 'Multiple / not specified');
      setText(card.querySelector('[data-repo-stars]'), `★ ${Number(repo.stargazers_count || 0)} stars`);
      const updated = card.querySelector('[data-repo-updated]');
      setText(updated, repo.updated_at ? `Updated ${dateLabel(repo.updated_at)}` : '');
      const description = card.querySelector('[data-repo-description]');
      if (description && repo.description) description.textContent = repo.description;
      const link = card.querySelector('[data-repo-api-link]');
      if (link && repo.html_url) link.href = repo.html_url;
    });
  };
  const getJson = async (url, signal) => {
    const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' }, signal, cache: 'no-store' });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    return response.json();
  };
  const initialise = async () => {
    const cached = safeReadCache();
    if (cached) {
      applyRepos(cached.repos, cached.publicRepoCount);
      renderEvents(cached.events);
      setText(document.querySelector('[data-github-followers]'), cached.followers == null ? '—' : String(cached.followers));
      setText(document.querySelector('[data-github-activity-updated]'), 'Cached public data');
      return;
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8500);
    const base = `https://api.github.com/users/${encodeURIComponent(username)}`;
    const results = await Promise.allSettled([
      getJson(`${base}/repos?type=owner&sort=updated&per_page=100`, controller.signal),
      getJson(`${base}/events/public?per_page=20`, controller.signal),
      getJson(base, controller.signal)
    ]);
    window.clearTimeout(timeout);
    const repos = results[0].status === 'fulfilled' ? results[0].value : null;
    const events = results[1].status === 'fulfilled' ? results[1].value : null;
    const user = results[2].status === 'fulfilled' ? results[2].value : null;
    if (repos || user) applyRepos(repos, user?.public_repos ?? null);
    if (events) renderEvents(events);
    if (user) setText(document.querySelector('[data-github-followers]'), String(user.followers ?? '—'));
    if (repos || events || user) safeWriteCache({ repos: repos || [], events: events || [], followers: user?.followers ?? null, publicRepoCount: user?.public_repos ?? repos?.length ?? null });
    if (!repos && !events && !user) {
      setText(document.querySelector('[data-github-activity-state]'), 'Open profile');
      setText(document.querySelector('[data-github-activity-updated]'), 'Live API unavailable; repository links remain active');
    }
  };
  initialise().catch(() => {
    setText(document.querySelector('[data-github-activity-state]'), 'Open profile');
    setText(document.querySelector('[data-github-activity-updated]'), 'Live GitHub data could not be loaded');
  });
})();
