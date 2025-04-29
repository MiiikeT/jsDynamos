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
// ALIS KOD BÖRJAR HÄR
function getToDos(buttonElement) {
  const cardElement = buttonElement.closest('.userCard');
  const userId = cardElement.querySelector('.userId').textContent;
  // alert(`ToDo-funktion för användare med ID: ${userId}`); 

  fetch(`https://jsonplaceholder.typicode.com/todos/?userId=${userId}`)
     .then(response => response.json())
     .then(todos => {
       todoList.innerHTML = '';
       todoDetails.innerHTML = '';

       todos.forEach(todo => {
         const li = document.createElement('li');
         li.textContent = `Todo ID: ${todo.id}`;
         li.style.cursor = 'pointer';

         li.addEventListener('click', () => {
           showTodoDetails(todo);
         });

         todoList.appendChild(li);
       });
     })
     .catch(error => {
       console.error('Fel vid hämtning av todos:', error);
     });


}

function showTodoDetails(todo) {
  todoDetails.innerHTML = `
    <h3>Detaljer för Todo:</h3>
    <p><strong>ID:</strong> ${todo.id}</p>
    <p><strong>Titel:</strong> ${todo.title}</p>
    <p><strong>Slutförd:</strong> ${todo.completed ? 'Ja' : 'Nej'}</p>
  `;
}

getUserInfo();
