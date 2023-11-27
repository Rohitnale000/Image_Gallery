let cartContainer = document.getElementById("cart-container");
let tableContainer = document.getElementById("table-container");
let cardTab = document.getElementById("card-tab");
let listTab = document.getElementById("list-tab");
let previweCardBtn = document.getElementById("previwe-card-btn");
let form = document.getElementById("form");
const fileInput = document.getElementById("upload");
let imageArray = [];
let uploaderArray = JSON.parse(localStorage.getItem("Photos_Gallery")) || [];
const units = ["bytes", "KB", "MB"];
let flag = false;
const dragDropContainer = document.querySelector(".input-bx");
let targetImageId;
let playInterval;
let currentIndex = 0;
let elem = document.getElementById("myBar");
elem.style.width = 0 + "%";

//defult table is not dispaly
tableContainer.style.display = "none";
cardTab.addEventListener("click", () => {
  document.getElementById("cart-contain").style.display = "";
  tableContainer.style.display = "none";
});

listTab.addEventListener("click", () => {
  tableContainer.style.display = "";
  document.getElementById("cart-contain").style.display = "none";
});

function convertSize(x) {
  let l = 0,
    n = parseInt(x, 10) || 0;
  while (n >= 1024 && ++l) {
    n = n / 1024;
  }
  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
}

//when file inside in the drag area
dragDropContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  dragDropContainer.classList.add("dragover");
});

// //when file inside dragover area
dragDropContainer.addEventListener("dragleave", () => {
  dragDropContainer.classList.remove("dragover");
});

// Handle the drop event to handle the dropped files
dragDropContainer.addEventListener("drop", async (e) => {
  e.preventDefault();
  dragDropContainer.classList.remove("dragover");
  const imageFiles = e.dataTransfer.files;
  const element = document.querySelector(".filewrapper");
  for (const image of imageFiles) {
    const imageData = await readImageFile(image);
    imageArray.push(imageData);
    const li = document.createElement("div");
    li.className = "showfilebox shadow";
    li.innerHTML = `
    <div class="d-flex left">
      <img src="${imageData.img
      }" class="img-fluid rounded-2 image-list" alt="...">
    <div class="ps-4">
        <span class="fw-bold">${imageData.name}</span>
        <div class="d-flex list-description pt-2">
            <span class="fw-medium text-secondary">Size: ${imageData.size
      }</span>
            <span class="fw-medium text-secondary ps-3">Modified Time: ${imageData.date.toLocaleString()}</span>
        </div>
        <div class="pt-2">
            <a class="delete-btn text-secondary" onclick="onRemoveImage('${imageData.id
      }')">Delete</a>
        </div>
    </div> 
  </div>
          `;
    element.appendChild(li);
  }
});

async function handleFileInputChange(event) {
  const imageFiles = event.target.files;
  const element = document.querySelector(".filewrapper");
  for (const image of imageFiles) {
    const imageData = await readImageFile(image);
    imageArray.push(imageData);
    const li = document.createElement("div");
    li.className = "showfilebox shadow";
    li.innerHTML = `
    <div class="d-flex left">
      <img src="${imageData.img
      }" class="img-fluid rounded-2 image-list" alt="...">
    <div class="ps-4">
        <span class="fw-bold">${imageData.name}</span>
        <div class="d-flex list-description pt-2">
            <span class="fw-medium text-secondary">Size: ${imageData.size
      }</span>
            <span class="fw-medium text-secondary ps-3">Modified Time: ${imageData.date.toLocaleString()}</span>
        </div>
        <div class="pt-2">
            <a class="delete-btn text-secondary" onclick="onRemoveImage('${imageData.id
      }')">Delete</a>
        </div>
    </div> 
  </div>
          `;
    element.appendChild(li);
  }
}

function readImageFile(image) {
  const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!validImageTypes.includes(image.type)) {
    swal("Please select a valid image!!", "(JPEG, PNG, or JPG)");
    return false;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const result = reader.result;
      const obj = {
        id: Math.floor(Math.random() * (9999 - 1000 + 1) + 1000),
        name: image.name,
        size: convertSize(image.size),
        type: image.type,
        img: result,
        date: image.lastModifiedDate,
      };
      resolve(obj);
    });
    if (image) {
      reader.readAsDataURL(image);
    }
  });
}

const onRemoveImage = (id) => {
  imageArray = imageArray.filter((value) => {
    return value.id != id;
  });
  const element = document.querySelector(".filewrapper");
  element.innerHTML = "";
  for (let i = 0; i < imageArray.length; i++) {
    const imageData = imageArray[i];
    const li = document.createElement("div");
    li.className = "showfilebox shadow";
    li.innerHTML = `
    <div class="d-flex left">
        <img src="${imageData.img
      }" class="img-fluid rounded-2 image-list" alt="...">
  <div class="ps-4">
      <span class="fw-bold">${imageData.name}</span>
      <div class="d-flex list-description pt-2">
          <span class="fw-medium text-secondary">Size: ${imageData.size}</span>
          <span class="fw-medium text-secondary ps-3">Modified Time: ${imageData.date.toLocaleString()}</span>
      </div>
      <div class="pt-2">
          <a class="delete-btn text-secondary" onclick="onRemoveImage('${imageData.id
      }')">Delete</a>
      </div>
  </div> 
</div>
       `;
    element.appendChild(li);
  }
};

fileInput.addEventListener("change", handleFileInputChange);

document.getElementById("upload-btn").addEventListener("click", () => {
  if (imageArray.length > 0) {
    uploaderArray = uploaderArray.concat(imageArray);
    localStorage.setItem("Photos_Gallery", JSON.stringify(uploaderArray));
    displayPhotos();
    const element = document.querySelector(".filewrapper");
    element.innerHTML = "";
    imageArray = [];
    toastr.success("Upload Success ", "SUCCESS");
    document.getElementById("closeBtn").click();
  } else {
    toastr.error("Please select image", "ERROR");
  }
});

const displayGrid = (uploaderArray) => {
  let gallery = "";
  uploaderArray.map((item) => {
    gallery += `
      <div class="col-lg-2 col-sm-12 pt-4">
      <div class="card border-0 pb-4 hovereffect">
          <img class="card-img-top img-fluid rounded shadow" src="${item.img}" alt="Card image cap">
          <div class="overlay">
              <h2>${item.name}</h2>
              <a class="info" id="previwe-card-btn" data-bs-toggle="modal" href="#exampleModalToggle4" role="button" onclick="onPreview('${item.id}')">Preview</a>
          </div>
          <span class="fw-medium text-secondary img-name">${item.name}</span>
      </div>
  </div>`;
  });
  document.getElementById("cart-container").innerHTML = gallery;
};

//this function preview selected image in modal
const thumbnailGrid = (id) => {
  targetImageId = id;
  const currentItem = uploaderArray.find((item) => item.id === Number(id));
  if (currentItem) {
    document.getElementById("thumbnailgrid").innerHTML = `
      <div class="modal-content">
        <div class="modal-header bg-black border-bottom-0">
          <i class="fa-circle-play fa-regular play" onclick="playAllImages()"></i>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onclick="stopPlay()"></button>
        </div>
        <div class="modal-body bg-black ">
          <div class="container text-center main-model">
            <i id="left" class="fa-solid fa-arrow-left" onclick="onPrivious()"></i>
            <img src="${currentItem.img}" class="set-img image-animation">
            <i id="right" class="fa-solid fa-arrow-right" onclick="onNext()"></i>
          </div>
          <div class="wrapper pb-4 ps-2 pt-5">
            <div class="carousel1 bg-black">${allImagesThumbnailGrid(id)}</div>
          </div>
        </div>
      </div>`;
  }
  sliderContainer();
};

//display all images bottom of the screen
const allImagesThumbnailGrid = (id) => {
  let images = "";
  uploaderArray.forEach((item) => {
    const borderClass =
      item.id == id
        ? "border border-3 border-danger"
        : "border border-2 border-white";
    images += `
      <img src="${item.img}" class="${item.id} img-fluid rounded-3 ${borderClass}" onclick="displayImgInModule(${item.id})">
      `;
  });
  return images;
};

//display target image inside the thumbnail grid modal
function displayImgInModule(id) {
  targetImageId = id;
  thumbnailGrid(id);
}

//for next image display
const onNext = () => {
  const target = uploaderArray.findIndex((item) => {
    return item.id == targetImageId;
  });
  let index = target + 1;
  const data = uploaderArray.at(index).id;
  targetImageId = data;
  thumbnailGrid(data);
};

//for privious image display
const onPrivious = () => {
  const target = uploaderArray.findIndex((item) => {
    return item.id == targetImageId;
  });
  let index = target - 1;
  const data = uploaderArray.at(index).id;
  targetImageId = data;
  thumbnailGrid(data);
};

const onPreview = (id) => {
  thumbnailGrid(id);
  sliderContainer();
};

function sliderContainer() {
  // Your slider code here
  const carousel = document.querySelector(".carousel1");
  let isDragStart = false,
    isDragging = false,
    prevPageX,
    prevScrollLeft,
    positionDiff;

  const dragStart = (e) => {
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = carousel.scrollLeft;
  };

  const dragging = (e) => {
    if (!isDragStart) return;
    e.preventDefault();
    isDragging = true;
    carousel.classList.add("dragging");
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    carousel.scrollLeft = prevScrollLeft - positionDiff;
  };

  const dragStop = () => {
    isDragStart = false;
    carousel.classList.remove("dragging");
    if (!isDragging) return;
    isDragging = false;
  };

  carousel.addEventListener("mousedown", dragStart);
  carousel.addEventListener("touchstart", dragStart);

  document.addEventListener("mousemove", dragging);
  carousel.addEventListener("touchmove", dragging);

  document.addEventListener("mouseup", dragStop);
  carousel.addEventListener("touchend", dragStop);
}



function playAllImages() {
  stopPlay();
  playInterval = setInterval(() => {
    setTimeout(() => {
      move();
    }, 1000);
    thumbnailGrid(uploaderArray[currentIndex].id);
    currentIndex = currentIndex + 1;
    elem.style.width = 0 + "%";
  }, 5100);
}

function stopPlay() {
  elem.style.width = "0px";
  clearInterval(playInterval);
}

let i = 0;
function move() {
  if (i === 0) {
    i = 1;
    let elem = document.getElementById("myBar");
    let width = 1;
    let id = setInterval(frame, 4);

    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width = width + 0.1;
        elem.style.width = width + "%";
      }
    }
  }
}

const displayPhotos = () => {
  displayGrid(uploaderArray);
  displayPhotosInTable(uploaderArray);
};

const onDeleteAll = () => {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this imaginary file!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      swal("Poof! Your imaginary file has been deleted!", {
        icon: "success",
      });
      localStorage.clear("Photos_Gallery");
      uploaderArray = [];
      displayGrid(uploaderArray);
      displayPhotosInTable(uploaderArray);
    } else {
      swal("Your imaginary file is safe!");
    }
  });
};

const displayPhotosInTable = (uploaderArray) => {
  let output = document.querySelector("tbody");
  output.innerHTML = "";
  uploaderArray.map((item) => {
    output.innerHTML += `
    <tr class="border-none">
    <td class="d-flex align-items-center w-100">
        <div>
            <img src="${item.img}" id="small-image" class="rounded img-fluid" alt="Sheep">
        </div>
        <div class="ms-4">
            <span class="text-secondary fw-bold">${item.name}</span>
            <span class="d-block text-secondary fw-bold ">${item.size}</span>
        </div>
    </td>
    <td class="pt-3 text-center"><button id="previwe-card-btn" data-bs-toggle="modal" href="#exampleModalToggle4" class="btn btn-light" onclick="onPreview('${item.id}')">Preview</button></td>
</tr>
    `;
  });
};

const onSearch = (event) => {
  let output = document.querySelector("tbody");
  output.innerHTML = "";
  let gallery = "";
  let filter = document.getElementById("search").value.toUpperCase();
  uploaderArray.map((item) => {
    if (item.name.toUpperCase().includes(filter)) {
      gallery += `
      <div class="col-lg-2 col-sm-12 pt-4">
      <div class="card border-0 pb-4 hovereffect">
          <img class="card-img-top img-fluid rounded shadow" src="${item.img}" alt="Card image cap">
          <div class="overlay">
              <h2>${item.name}</h2>
              <a class="info" id="previwe-card-btn" data-bs-toggle="modal" href="#exampleModalToggle4" role="button" onclick="onPreview('${item.id}')">Preview</a>
          </div>
          <span class="fw-medium text-secondary img-name">${item.name}</span>
      </div>
  </div>`;
      document.getElementById("cart-container").innerHTML = gallery;
      output.innerHTML += `
      <tr class="border-none">
      <td class="d-flex align-items-center w-100">
          <div>
              <img src="${item.img}" id="small-image" class="rounded img-fluid" alt="Sheep">
          </div>
          <div class="ms-4">
              <span class="text-secondary fw-bold">${item.name}</span>
              <span class="d-block text-secondary fw-bold ">${item.size}</span>
          </div>
      </td>
      <td class="pt-3 text-center"><button id="previwe-card-btn" data-bs-toggle="modal" href="#exampleModalToggle4" class="btn btn-light" onclick="onPreview('${item.id}')">Preview</button></td>
  </tr>
      `;
    }
  });
};
