function getUserInfo() {
  fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      return response.json();
    })
    .then(users => {
      let userList = document.querySelector(".userList");

      users.forEach(user => {
        let userCard = document.createElement("div");
        userCard.classList.add("userCard");

        userCard.innerHTML = `
          <div class="userVisual">
            <div class="userImg-container"></div>
            <p class="userId">${user.id}.</p>
            <p class="userName"> ${user.name}</p>
          </div>
          <div class="onClickInfo"></div>
        `;

        userCard.addEventListener("click", function () {
          this.querySelector(".onClickInfo").innerHTML = `
            <div class="buttonContainer">
              <button class="cardButton" onclick="getPosts()">Post</button>
              <button class="cardButton" onclick="getToDos()">ToDo</button>
            </div>
            <div class="userInfo">
            <p class="userUserName">${user.username}</p>
            <p class="userEmail">${user.email}</p>
            </div>
          `;
        });

        userList.appendChild(userCard);
      });
    })
    .catch(e => {
      alert("Error: " + e);
    });
}

getUserInfo();
