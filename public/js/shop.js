document.addEventListener('DOMContentLoaded',() => {
  fetch('/shop/api/criteria?priority=0')
    .then(response => response.json())
    .then(data => {
      const imageContainer = document.getElementById('image-container');
      let newDiv;

      data.images.forEach((image,index) => {
        if(index % 2 == 0) {
          newDiv = document.createElement('div');
          newDiv.setAttribute('class','c-images');
        }
        const img = document.createElement('img');
        img.src = `../images/${image}`;
        img.alt = 'Product Images';
        img.setAttribute('class','pimages');
        newDiv.appendChild(img)
        if(index % 2 !== 0 || index ===  data.images.length - 1) {
          imageContainer.appendChild(newDiv);
        }
      });
    })
    .catch(error => {
      console.log(error);
      errorlog.error('Error fetching images for shop:',error);
    })
});

let loading = false;
let page = 0;

let type = document.getElementById('type');
let colour = document.getElementById('colour');
let collection = document.getElementById("collection");
let maxPrice = document.getElementById('max-price');
let minPrice = document.getElementById('min-price');
let maxAge = document.getElementById('max-age');
let minAge = document.getElementById('min-age');
let priceFill = document.getElementById('price-fill');
let ageFill = document.getElementById('age-fill');


maxPrice.oninput = () => {
  if(minPrice.value > maxPrice.value) {
    temp = minPrice;
    minPrice = maxPrice;
    maxPrice = temp;
  }
  priceFill.innerHTML = `Rs ${minPrice.value} - Rs ${maxPrice.value}`;
}

minPrice.oninput = () => {
  if(minPrice.value > maxPrice.value) {
    temp = minPrice;
    minPrice = maxPrice;
    maxPrice = temp;
  }
  priceFill.innerHTML = `Rs ${minPrice.value} - Rs ${maxPrice.value}`;
}

maxAge.oninput = () => {
  if(minAge.value > maxAge.value) {
    temp = minAge;
    minAge = maxAge;
    maxAge = temp;
  }
  ageFill.innerHTML = `${minAge.value} - ${maxAge.value}`;
}

minAge.oninput = () => {
  if(minAge.value > maxAge.value) {
    temp = minAge;
    minAge = maxAge;
    maxAge = temp;
  }
  ageFill.innerHTML = `${minAge.value} - ${maxAge.value}`;
}

function on() {
  document.getElementById("overlay").style.display = "block";
}

function off() {
  document.getElementById("overlay").style.display = "none";
}

// async function fetchImg() {
//   if(loading) return;
//   loading = true;
//
//   document.getElementById('loading').style.display = 'block';
//
//   try {
//     const response = await fetch(`/shop/api/images?page=${page}`);
//     const images = await response.json();
//     if(images.length == 0) {
//       document.getElementById('loading').textContent = 'End';
//       return;
//     }
//
//     const newDiv = document.createElement('div');
//
//     newDiv.setAttribute('class','c-images');
//     images.forEach(image => {
//       const img = document.createElement('img');
//       img.src = `../images/${image.image_id}`;
//       newDiv.appendChild(img);
//     });
//
//     page++;
//   } catch(error) {
//     throw error;
//   } finally {
//     loading = false;
//     document.getElementById('loading').style.display = 'none';
//   }
// };

function fetchImg(url) {
  if(loading) return;
  loading = true;

  document.getElementById('loading').style.display = 'block';

  try {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const imageContainer = document.getElementById('image-container');
        let newDiv;

        data.images.forEach((image,index) => {
          if(index % 2 == 0) {
            newDiv = documnet.createElement('div');
            newDiv.setAttribute('class','c-images');
          }

          const img = document.createElement('img');
          img.setAttribute('class','pimages');
          img.src = `../images/${image}`
          img.alternate = 'Product Images';
          newDiv.appendChild(img);
          if(index % 2 !== 0 || index === data.images.index - 1) {
            imageContainer.appendChild(newDiv);
          }
        });
      });
    document.getElementById('loading').style.display = 'none';
  } catch(error) {
    console.log(error);
  }
}

// function postSearch() {
//   type = document.getElementById('type').value;
//   minPrice = document.getElementById('min-price').value;
//   maxPrice = document.getElementById('max-price').value;
//   minAge = document.getElementById('min-age').value;
//   maxAge = document.getElementById('max-age').value;
//   colour = document.getElementById('colour').value === '' ? null : document.getElementById('colour').value;
//   collection = document.getElementById('collection').value === '' ? null : document.getElementById('collection').value;
//
//   let url = '/shop/api/criteria?';
//   let criteria = '';
//   if(type) criteria += `type=${type}`;
//   if(minPrice) {
//     if(criteria) criteria += '&';
//     criteria += `minprice=${minPrice}`;
//   }
//   if(maxPrice) {
//     if(criteria) criteria += '&';
//     criteria += `maxprice=${maxPrice}`;
//   }
//   if(minAge) {
//     if(criteria) criteria += '&';
//     criteria += `minage=${minAge}`;
//   }
//   if(maxAge) {
//     if(criteria) criteria += '&';
//     criteria += `maxage=${maxAge}`;
//   }
//   if(collection) {
//     if(criteria) criteria += '&';
//     criteria += `collection=${collection}`;
//   }
//   if(colour) {
//     if(criteria) criteria += '&';
//     criteria += `colour=${colour}`;
//   }
//   url += criteria
//   
//   fetch(url)
//     .then(response => response.json())
//     .then(data => {
//       const imageContainer = document.getElementById('image-container');
//       let newDiv;
//
//       data.images.forEach((image,index) => {
//         if(index % 2 == 0) {
//           newDiv = document.createElement('div');
//           newDiv.setAttribute('class','c-images');
//         }
//         const img = document.createElement('img');
//         img.src = `../images/${image}`;
//         img.alt = 'Product Images';
//         img.setAttribute('class','pimages');
//         newDiv.appendChild(img)
//         if(index % 2 !== 0 || index ===  data.images.length - 1) {
//           imageContainer.appendChild(newDiv);
//         }
//       });
//
//     })
//     .catch(error => {
//       console.log(error);
//     });
// }

function postSearch(bool) {
  type = document.getElementById('type').value;
  minPrice = document.getElementById('min-price').value;
  maxPrice = document.getElementById('max-price').value;
  minAge = document.getElementById('min-age').value;
  maxAge = document.getElementById('max-age').value;
  colour = document.getElementById('colour').value === '' ? null : document.getElementById('colour').value;
  collection = document.getElementById('collection').value === '' ? null : document.getElementById('collection').value;

  let url = '/shop/api/criteria?';
  let criteria = '';
  if(type) criteria += `type=${type}`;
  if(minPrice) {
    if(criteria) criteria += '&';
    criteria += `minprice=${minPrice}`;
  }
  if(maxPrice) {
    if(criteria) criteria += '&';
    criteria += `maxprice=${maxPrice}`;
  }
  if(minAge) {
    if(criteria) criteria += '&';
    criteria += `minage=${minAge}`;
  }
  if(maxAge) {
    if(criteria) criteria += '&';
    criteria += `maxage=${maxAge}`;
  }
  if(collection) {
    if(criteria) criteria += '&';
    criteria += `collection=${collection}`;
  }
  if(colour) {
    if(criteria) criteria += '&';
    criteria += `colour=${colour}`;
  }
  url += criteria

  if(bool === true) {
    fetchImg(url);
  } else if(bool === false) {
    document.getElementById('image-container').innerHTML = '';
    fetchImg(url);
  }

}

window.addEventListener('scroll',() => {
  if(window.innerHeight + window.scrollY >= document.body.scrollHeight - 100) {
    postSearch(true);
  }
});
