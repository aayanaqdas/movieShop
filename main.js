

function generateMovieElements() {
  const movieContainer = document.getElementById("movieContainer");
//Movies variabelen ligger i filen movies.js
  movies.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.id = movie.id;
    movieElement.className = "movieEl";
    movieElement.innerHTML = `

  
            <div class="card">
                <a class="card-media" href="">
                    <img src="${movie.imageUrl}" alt="${movie.title}" width="100%" />
                </a>
                <div class="card-content">
                    <div class="card-header">
                        <div class="left-content">
                        <h3 class="movieTitle">${movie.title}</h3>
                        <span class="yearText">${movie.year}</span>
                        </div>
                    <div class="right-content">
                    <button onclick="addToCart(${movie.id})" class="card-btn">Add to cart</button>
                    </div>
                </div>
                <div class="info">
                   Price:  ${movie.price + " Kr"|| "No price yet..."}
                </div>
            </div>
        </div>

 `;
/*
      <div class="movie-card">
       <img src="${movie.imageUrl}" alt="${movie.title}">
       <h2>${movie.title}</h2>
       <p>${movie.info}</p>
       <p>Price: ${movie.price} Kr</p>
       <button onclick="addToCart(${movie.id})">Add to Cart</button>
       </div>
       */

    movieContainer.appendChild(movieElement);
  });
}

function addToCart(movieId) {
  console.log(movieId);
}

generateMovieElements();
