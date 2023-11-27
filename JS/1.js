//this function preview selected image in modal
const thumbnailGrid = (id) => {
  const currentItem = uploaderArray.find(item => item.id === Number(id));
  if (currentItem) {
    document.getElementById("thumbnailgrid").innerHTML = `
      <div class="modal-content">
        <div class="modal-header bg-black border-bottom-0">
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
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
};


//display all images bottom of the screen
const allImagesThumbnailGrid = (id) => {
  let images = "";
  uploaderArray.forEach((item) => {
    const borderClass =
      item.id == id
        ? "border border-3 border-danger"
        : "border border-2 border-white"; // Add a border class if IDs match
    images += `
      <img src="${item.img}" class="${item.id} img-fluid rounded-3 ${borderClass}" onclick="displayImgInModule(${item.id})">
      `;
  });
  return images;
};


//display target image inside the thumbnail grid modal
function displayImgInModule(id) {
  targetImageId = id;
  thumbnailGrid(id)
}


const onNext=()=>{
  const target = uploaderArray.findIndex((item) =>{
    return item.id == targetImageId
  })
  let index = target+1;
  const data = uploaderArray.at(index).id
  targetImageId=data
  thumbnailGrid(data)  
}


const onPrivious=()=>{
  const target = uploaderArray.findIndex((item) =>{
    return item.id == targetImageId
  })
  let index = target-1;
  const data = uploaderArray.at(index).id
  targetImageId=data
  thumbnailGrid(data)  
}


const onPreview = (id) => {
  thumbnailGrid(id);

  const carousel = document.querySelector(".carousel1");
  const leftArrow = document.getElementById("left");
  const rightArrow = document.getElementById("right");
  const setImgElement = document.querySelector(".set-img");

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

  const scrollImages = (direction) => {
    const firstImgWidth = carousel.querySelector("img").clientWidth + 14;
    carousel.scrollLeft += direction === "left" ? -firstImgWidth : firstImgWidth;

    // Get the currently displayed image index
    const currentIndex = Math.round(carousel.scrollLeft / firstImgWidth);
    
    // Update the setImgElement source
    setImgElement.src = uploaderArray[currentIndex].img;
  };

  carousel.addEventListener("mousedown", dragStart);
  document.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragStop);

  leftArrow.addEventListener("click", () => scrollImages("left"));
  rightArrow.addEventListener("click", () => scrollImages("right"));
};
