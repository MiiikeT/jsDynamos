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
              <button class="cardButton" onclick="getToDos()">ToDo</button>
            </div>
            <div class="userInfo">
            <p class="userUserName">${user.username}</p>
            <p class="userEmail">${user.email}</p>
            </div>
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
// function toggleDropdown(cardElement) {
//   let dropdownBox = document.querySelector('.dropdownBox');

//   if (!dropdownBox) {
//     console.error('Dropdown-boxen hittades inte.');
//     return;
//   }

//   // Om dropdown redan är synlig och samma kort klickas, göm den
//   if (dropdownBox.style.display === 'block' && dropdownBox.dataset.card === cardElement.dataset.card) {
//     dropdownBox.style.display = 'none';
//     return;
//   }

//   // Fyll dropdown-boxen med posts och kommentarer
//   let userId = cardElement.querySelector('.userId').textContent;
//   fillDropdownWithPostsAndComments(userId);

//   // Positionera dropdown-boxen
//   const cardRect = cardElement.getBoundingClientRect();

//   dropdownBox.dataset.card = cardElement.dataset.card;
// }

function getToDos() {
  alert("ToDo-funktion ännu ej implementerad!"); // Placeholder för ToDo-funktion
}

getUserInfo();
