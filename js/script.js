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

      users.forEach((user, index) => {
        let userCard = document.createElement("div");
        userCard.classList.add("userCard");
        userCard.dataset.card = index; // Lägg till ett unikt data-attribut

        userCard.innerHTML = `
          <div class="userVisual">
            <div class="userImg-container"></div>
            <p class="userName">${user.name}</p>
            <p class="userId">${user.id}</p>
          </div>
          <div class="onClickInfo">
            <div class="buttonContainer">
              <button class="cardButton" onclick="toggleDropdown(this.closest('.userCard'))">Post</button>
              <button class="cardButton" onclick="getToDos(this)">ToDo</button>
            </div>
            <p class="userUserName">${user.username}</p>
            <p class="userEmail">${user.email}</p>
          </div>
          <div class="dropdownBox"></div>
        `;

        userList.appendChild(userCard);
      });
    })
    .catch(e => {
      alert("Error: " + e);
    });
}

function fillDropdownWithPostsAndComments(userId, dropdownBox) {
  
  // Rensa tidigare innehåll
  dropdownBox.innerHTML = '';

  // Hämta posts från användaren
  fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Kunde inte hämta posts.');
      }
      return response.json();
    })
    .then(posts => {
      posts.forEach(post => {
        // Skapa post-elementet
        let postElement = document.createElement('div'); // Ali Titta här!!!!!! =============Implementera detta med din kod från rad 124=====================
        postElement.classList.add('post');
        postElement.innerHTML = `
          <p>${post.id}</p>
          <h3>${post.title}</h3>
          <p>${post.body}</p>
        `;

        // Hämta kommentarer för posten
        fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Kunde inte hämta kommentarer.');
            }
            return response.json();
          })
          .then(comments => {
            comments.forEach(comment => {
              let commentElement = document.createElement('p');
              commentElement.textContent = `Kommentar: ${comment.body}`;
              postElement.appendChild(commentElement);
            });
          })
          .catch(e => {
            console.error('Fel vid hämtning av kommentarer:', e);
          });

        dropdownBox.appendChild(postElement);
      });

      // Visa dropdown-boxen
      dropdownBox.style.display = 'block';
    })
    .catch(e => {
      console.error('Fel vid hämtning av posts:', e);
    });
}

function toggleDropdown(cardElement) {
  const dropdownBox = cardElement.querySelector('.dropdownBox'); // Lokal istället för global querySelector

  if (!dropdownBox) {
    console.error('Dropdown-boxen hittades inte i kortet.');
    return;
  }

  const isVisible = dropdownBox.style.display === 'block';

  // Nytt: Stäng alla andra dropdowns först (om du bara vill ha en öppen åt gången)
  document.querySelectorAll('.dropdownBox').forEach(box => {
    box.style.display = 'none';
  });

  if (isVisible) {
    dropdownBox.style.display = 'none'; // Toggle-stäng om samma kort
  } else {
    const userId = cardElement.querySelector('.userId').textContent;
    fillDropdownWithPostsAndComments(userId, dropdownBox); // Skickar med rätt box
  }
}

function createUserCard(user) {
  const userCard = document.createElement("div");
  userCard.classList.add("userCard");

  const userVisual = document.createElement("div");
  userVisual.classList.add("userVisual");

  const imgContainer = document.createElement("div");
  imgContainer.classList.add("userImg-container");

  const userName = document.createElement("p");
  userName.classList.add("userName");
  userName.textContent = user.name;

  imgContainer.appendChild(userName);
  userVisual.appendChild(imgContainer);
  userCard.appendChild(userVisual);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("buttonContainer");

  const postsButton = document.createElement("button");
  postsButton.classList.add("cardButton");
  postsButton.textContent = "Posts";

  const todoButton = document.createElement("button");
  todoButton.classList.add("cardButton");
  todoButton.textContent = "ToDo";

  buttonContainer.appendChild(postsButton);
  buttonContainer.appendChild(todoButton);
  userCard.appendChild(buttonContainer);

  const userInfo = document.createElement("div");
  userInfo.classList.add("userInfo");
  userInfo.innerHTML = `
    <h3>${user.username}</h3>
    <p>Email: ${user.email}</p>
    <p>Phone: ${user.phone}</p>
    <p>Website: ${user.website}</p>
  `;
  userCard.appendChild(userInfo);

  const dropdownBox = document.createElement("div");
  dropdownBox.classList.add("dropdownBox");
  userCard.appendChild(dropdownBox);

  let activeType = null; 
  postsButton.addEventListener("click", () => {
    if (dropdownBox.style.display === "block" && activeType === "posts") {
      dropdownBox.style.display = "none";
      activeType = null;
    } else {
      dropdownBox.innerHTML = "";
      dropdownBox.style.display = "block";
      activeType = "posts";

      fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`)
      .then((res) => res.json())
      .then((posts) => {
        posts.forEach((post) => {
          let postElement = document.createElement("div");
          postElement.classList.add("post");
          postElement.innerHTML = `
            <p>${post.id}</p>
            <h3>${post.title}</h3>
            <p>${post.body}</p>
          `;
          dropdownBox.appendChild(postElement);
        });
      });
  }
});

  todoButton.addEventListener("click", () => {
    if (dropdownBox.style.display === "block" && activeType === "todo") {
      dropdownBox.style.display = "none";
      activeType = null;
    } else {
      dropdownBox.innerHTML = "";
      dropdownBox.style.display = "block";
      activeType = "todo";

      fetch(`https://jsonplaceholder.typicode.com/todos?userId=${user.id}`)
        .then((res) => res.json())
        .then((todos) => {
          todos.forEach((todo) => {
            let todoElement = document.createElement("div");
            todoElement.classList.add("post");
            todoElement.innerHTML = `
              <p>${todo.id}</p>
              <h3>${todo.title}</h3>
              <p>${todo.completed ? "✅" : "❌"}</p>
            `;
            dropdownBox.appendChild(todoElement);
          });
        });
    }
  });

  return userCard;
}

fetch("https://jsonplaceholder.typicode.com/users")
  .then((res) => res.json())
  .then((users) => {
    const userList = document.querySelector(".userList");
    users.forEach((user) => {
      const card = createUserCard(user);
      userList.appendChild(card);
    });
  });
