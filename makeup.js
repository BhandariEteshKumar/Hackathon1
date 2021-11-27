const url = "https://makeup-api.herokuapp.com/api/v1/products.json";
const productCatagories = [
  "Home",
  "lip_liner",
  "lipstick",
  "foundation",
  "eyeliner",
  "eyeshadow",
  "blush",
  "bronzer",
  "mascara",
  "eyebrow",
  "nail_polish",
];
let data;
const priceCatagories = ["2", "5", "10", "15", "20"];
const makeupCollection =
  document.getElementsByClassName("makeup-collection")[0];
document.addEventListener("DOMContentLoaded", function () {
  async function getData(type) {
    try {
      let responce = await fetch(url + type);
      let result = await responce.json();
      renderAll(result, "$");
      data = result;
    } catch (error) {
      console.log("Error");
    }
  }
  getData("");

  //the function renders the product api data and displays using DOM
  function renderProduct(product) {
    try {
      const productDiv = document.createElement("div");
      productDiv.className = "row product";
      productDiv.innerHTML = `
    <img class="col w-25 d-inline-block" src="${product.api_featured_image}" onerror="this.onerror=null; this.src='${product.image_link}'" alt="">`;
      makeupCollection.appendChild(productDiv);
      const innerDiv = document.createElement("div");
      innerDiv.className = "col";
      // the variables are used to ignore null values
      let productPrice = product.price;
      if (productPrice === null || parseInt(productPrice) == 0)
        productPrice = 1;
      let productBrand = product.brand;
      if (productBrand === null) productBrand = product.name;
      innerDiv.innerHTML = `
    <h3>${productBrand}</h3>
    <h4>${product.name}</h4>
      <p> Price : $${productPrice}</p>
      <p> Category : ${product.product_type}</p>
      <a href="${product.product_link}"><button class="btn btn-primary" name="button">Buy Now</button></a>
      <p class="description">Product Description : <br> ${product.description}</p>
      `;
      productDiv.appendChild(innerDiv);
    } catch (error) {
      console.log("Unable to render now");
    }
  }
  //this function takes all the api data and passes each json data to renderProduct function to render it
  function renderAll(products, condition) {
    makeupCollection.innerHTML = "";
    if (condition === "$") {
      products.map((product) => {
        renderProduct(product);
      });
    } else {
      products.map((product) => {
        if (parseInt(product.price) <= parseInt(condition))
          renderProduct(product);
      });
    }
  }
  //the function adds some navigation menu to get products from specific categorey
  function addCategories(caElement, navCatagory, tag) {
    let dollar = "";
    if (caElement === "navPrice") dollar = "Price less than or equal to $";
    navCatagory.forEach((element) => {
      const type = document.createElement("li");
      type.id = element + "li";
      type.innerHTML = `
      <button id="${element}" name="button-${tag}">${dollar}${element.toUpperCase()}</button>`;
      document.getElementById(caElement).appendChild(type);
    });
  }
  addCategories(`navid`, productCatagories, `catagory`);
  addCategories(`navPrice`, priceCatagories, `price`);

  // the eventlistener detects the click events, checks if the event is from button
  document.addEventListener("click", (e) => {
    console.log(data);
    let element = e.target;
    console.log(element);
    if (element.id === "Home") getData();
    else if (element.name === "button-price") renderAll(data, element.id);
    else if (element.name === "button-catagory") renderCatogery(element.id);
  });

  // it renders the specific category data
  async function renderCatogery(category) {
    makeupCollection.innerHTML = ``;
    getData(`?product_type=${category}`);
  }
});
