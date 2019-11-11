/* global document fetch */

async function generateFollower(name) {
  const container = document.getElementById('possible');

  // dt
  const nameHolder = document.createElement('dt');
  nameHolder.className = 'uk-text uk-margin';
  const names = document.createElement('h3');
  names.innerText = name;
  nameHolder.appendChild(names);
  container.appendChild(nameHolder);

  // dd
  const tailHolder = document.createElement('dd');

  // ul pt.1
  const buttonHolder = document.createElement('ul');
  buttonHolder.className = 'uk-subnav uk-subnav-pill';
  buttonHolder.setAttribute('uk-switcher', 'animation: uk-animation-fade');

  const unfollowList = document.createElement('li');
  const unfollow = document.createElement('a');
  unfollow.setAttribute('href', '#');
  unfollow.innerText = 'Unfollow';
  unfollowList.appendChild(unfollow);

  const followList = document.createElement('li');
  const follow = document.createElement('a');
  follow.setAttribute('href', '#');
  follow.innerHTML = 'Follow';
  followList.appendChild(follow);

  buttonHolder.appendChild(unfollowList);
  buttonHolder.appendChild(followList);
  tailHolder.appendChild(buttonHolder);

  // ul pt.2
  const wordHolder = document.createElement('ul');
  wordHolder.className = 'uk-switcher uk-margin';

  const unfollowList2 = document.createElement('li');
  unfollowList2.setAttribute('style', 'color:red');
  unfollowList2.innerHTML = 'Not Followed!';

  const followList2 = document.createElement('li');
  followList2.setAttribute('style', 'color:green');
  followList2.innerHTML = 'Followed!';

  wordHolder.appendChild(unfollowList2);
  wordHolder.appendChild(followList2);
  tailHolder.appendChild(wordHolder);

  container.appendChild(tailHolder);
}

// eslint-disable-next-line no-unused-vars
async function generateNames() {
  const userRes = await fetch('/user');
  const userJSON = await userRes.json();
  const userFollower = userJSON.followers;
  userFollower.forEach((element) => {
    generateFollower(element);
  });
}
