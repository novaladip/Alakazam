openImage = imgs => {
  const modal = document.getElementById("modalImage");

  // Get the image and insert it inside the modal
  const img = document.getElementById("reimbursementFoto");
  const modalImg = document.getElementById("img01");

  imgs.onclick = () => {
    modal.style.display = "block";
    modalImg.src = imgs.src;
  };

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = () => {
    modal.style.display = "none";
  };
};

// Get the modal
