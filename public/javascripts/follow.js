/* global document fetch */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */

async function addFriend(event) {
  const userInfo = await fetch('/user');
  const user = await userInfo.json();
  console.log(user.email);
  console.log(1);
  await fetch('/follow',
    {
      method: 'POST',
      body: JSON.stringify({
        username: user.username,
        followname: event.target.value,
        followArray: user.follower,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
  console.log(2);
}

async function generatePossibleFollow(other) {
  const container = document.getElementById('possible');

  // dt
  const nameHolder = document.createElement('dt');
  nameHolder.className = 'uk-text uk-margin';
  const names = document.createElement('h3');
  names.innerText = other.username;
  nameHolder.appendChild(names);
  container.appendChild(nameHolder);

  // dd
  const tailHolder = document.createElement('dd');

  // ul pt.1
  const buttonHolder = document.createElement('ul');
  buttonHolder.className = 'uk-subnav uk-subnav-pill';
  buttonHolder.setAttribute('uk-switcher', 'animation: uk-animation-fade');

  const unfollowList = document.createElement('li');
  const unfollow = document.createElement('button');
  unfollow.innerText = 'Unfollow';
  unfollowList.appendChild(unfollow);

  const followList = document.createElement('li');
  const follow = document.createElement('button');
  follow.innerHTML = 'Follow';
  follow.setAttribute('value', other.username);
  follow.addEventListener('click', addFriend);
  // follow.onclick = addFriend(user, other);
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
  const allRes = await fetch('/users');
  const userRes = await fetch('/user');
  const userJSON = await userRes.json();
  const users = await allRes.json();
  users.forEach((others) => {
    if (userJSON.username !== others.username && (users).length !== 1) {
      generatePossibleFollow(others);
    }
  });
}
