function getList() {
  return localStorage.getItem("image_id");
}
(function () {
  let imageList = getList();
  console.log(imageList);
  //const container = document.querySelector(".container");
  fetch('/api/getproductdata', {
    method: 'POST',
    headers:  {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ imageList: JSON.parse(imageList) }),
  })
    .then(response => response.json)
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.log(error);
    });
  for(let i = 0;i < data.length; i++) {
    const product = document.createElement("div");
    const img = document.createElement("img");
    const heading1 = document.createElement("h4");
    const heading2 = document.createElement("h4");
    const heading3 = document.createElement("h4");
    const heading4 = document.createElement("h4");
    const button = document.createElement("button");
    const icon = document.createElement("i");
    product.className = "product-cart";
    img.className = "product-image";
    icon.className = "fa-solid fa-trash";
    heading1.innerText = title;
    heading2.innerText = price;
    heading3.innerText = quantity;
    heading4.innerText = quantity * price;
    button.className = "button-cart";
    img.src = imageList[i];
    product.appendChild(img);
    product.appendChild(heading1);
    product.appendChild(heading2);
    product.appendChild(heading3);
    product.appendChild(heading4);
    product.appendChild(button);
    button.appendChild(icon);
  }
})();
