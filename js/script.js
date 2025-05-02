function getUserInfo() {
  fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => {
      if (!response.ok) {
        throw new Error("Unable to fetch users.");
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
            <p class="userId">${user.id}</p><p>.&nbsp;</p>
            <p class="userName">${user.name}</p>
          </div>
          <div class="onClickInfo"></div>
          <div class="dropdownBox"></div>
        `;

        userCard.addEventListener("click", function () { //onclick info populeras nu vid klick av user card
          this.querySelector(".onClickInfo").innerHTML = `
              <div class="buttonContainer">
                <button class="cardButton" onclick="toggleDropdown(this.closest('.userCard'))">Post</button>
                <button class="cardButton" id="todo" onclick="getToDos(this.closest('.userCard'), ${user.id})">ToDo</button>
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

function fillDropdownWithPostsAndComments(userId, dropdownBox) {
  
  // Rensa tidigare innehåll
  dropdownBox.innerHTML = '';

  // Hämta posts från användaren
  fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Unable to fetch posts.');
      }
      return response.json();
    })
    .then(posts => {
      posts.forEach(post => {
        // Skapa post-elementet
        let postElement = document.createElement('div');
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
              throw new Error('Unable to fetch comments.');
            }
            return response.json();
          })
          .then(comments => {
            comments.forEach(comment => {
              let commentElement = document.createElement('p');
              commentElement.textContent = `Comment: ${comment.body}`;
              postElement.appendChild(commentElement);
            });
          })
          .catch(e => {
            console.error('Unable to fetch comments:', e);
          });

        dropdownBox.appendChild(postElement);
      });

      // Visa dropdown-boxen
      dropdownBox.style.display = 'block';
    })
    .catch(e => {
      console.error('Unable to fetch posts:', e);
    });
}

function toggleDropdown(cardElement) {
  const dropdownBox = cardElement.querySelector('.dropdownBox'); // Lokal istället för global querySelector

  if (!dropdownBox) {
    console.error('Dropdown-box was not found.');
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



getUserInfo();

function getToDos(cardElement, userId) {
  const dropdownBox = cardElement.querySelector('.dropdownBox');
  const isVisible = dropdownBox.style.display === "block";

  // Close all other dropdowns
  document.querySelectorAll('.dropdownBox').forEach(box => box.style.display = 'none');

  if (isVisible) {
    dropdownBox.style.display = "none";
  } else {
    dropdownBox.innerHTML = "";
    dropdownBox.style.display = "block";

    fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to fetch todos.");
        }
        return res.json();
      })
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
      })
      .catch(e => {
        console.error("Todo fetch error:", e);
      });
  }
}