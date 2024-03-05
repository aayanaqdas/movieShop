

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
                        <div class="year_moreInfoBtn"> 
                          <span class="yearText">${movie.year}</span>
                          <a href="" class="moreInfoBtn">More Info</a>
                        </div>
                        
                
                        </div>
                    <div class="right-content">
                    
                    </div>
                </div>
                <div class="price">
                   Price:  ${movie.price + " Kr"}
                   <button onclick="addToCart(${movie.id})" class="card-btn">Buy</button>
                </div>
            </div>
        </div>

 `;
    movieContainer.appendChild(movieElement);
  });
}

function addToCart(movieId) {
  
  console.log(movieId);
}

generateMovieElements();
