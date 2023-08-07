let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = 'block';
    } else {
      toyFormContainer.style.display = 'none';
    }
  });
});
// create card for very toy object 
function createToyCard(toy) {
  const cards = document.createElement('div');
  cards.classList.add('card');

  const name = document.createElement('h2'); 
  name.textContent = toy.name;
  cards.appendChild(name);

  const image = document.createElement('img');
  image.src = toy.image;
  image.alt = toy.name;
  image.classList.add('toy-avatar');
  cards.appendChild(image);

  const likes = document.createElement('p');
  likes.textContent = `${toy.likes} Likes`;
  cards.appendChild(likes);

  const likeBtn = document.createElement('button');
  likeBtn.classList.add('like-btn');
  likeBtn.setAttribute('id', toy.id);
  likeBtn.textContent = 'Like ❤️ ';
  likeBtn.addEventListener('click', handleLikeButtonClick);
  cards.appendChild(likeBtn);
//toy details 
  return cards;
}
// fetch toy objects and add cards to the toy-collection div
function loadToys(){
  fetch('http://localhost:3000/toys')
  .then(response => {
    if(!response.ok) {
      throw new Error('Request failed');
    } 
    return response.json(); 
  })
  .then(data => {
    const toyCollection = document.getElementById('toy-collection'); 

// creates and adds a card for each toy object 

    data.forEach(toy => {
      const card = createToyCard(toy);
      toyCollection.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Error', error); 
  });
}
window.addEventListener('load', loadToys);



const form = document.getElementById('add-toy-form');
if (form){
form.addEventListener('submit', handleFormSubmit);
}
function handleFormSubmit (myEvent)  {
  myEvent.preventDefault();
  const formData = new FormData(myEvent.target); 
  const newToy = Object.fromEntries(formData.entries());

  addNewToy(newToy)
}; 

function addNewToy(newToy) {
  const url = 'http://localhost:3000/toys';
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }, 
    body: JSON.stringify(newToy),
  };
  fetch(url, requestOptions)
  .then(response => {
    if(!response.ok) {
      throw new Error('Request failed');
    } 
    return response.json();
  })
  .then(data => {
    const toyCollection = document.getElementById('toy-collection');
    const newToyCard = createToyCard(data); 
    toyCollection.appendChild(newToyCard);
  })
  .catch(error => {
    console.error('Error:', error);
  });

}

function handleLikeButtonClick(event) {
  const toyId = event.target.id;
  const cards = event.target.parentElement;

  const likesElement = cards.querySelector('p');
  const currentLikes = parseInt(likesElement.textContent);

  const newLikes = currentLikes + 1;

  const url = `http://localhost:3000/toys/${toyId}`;
  const requestOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({likes: newLikes}),
  };
  fetch(url, requestOptions)
  .then ((response) => {
    if (!response.ok) {
      throw new Error('Request failed');
    }
    return response.json();
  })
  .then((data) => {
    likesElement.textContent = `${data.likes} Likes `;
  })
  .catch((error) => {
    console.error('Error:', error);
  });
} 