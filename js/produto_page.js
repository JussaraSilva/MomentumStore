const imgPrincipal = document.getElementById("imgPrincipal");
const imgZoom = document.getElementById("imgZoom");
const lupa = document.getElementById("lupa");
const thumbs = document.querySelectorAll(".thumb");

// troca imagem ao clicar na thumb
thumbs.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    thumbs.forEach((t) => t.classList.remove("active"));
    thumb.classList.add("active");

    imgPrincipal.src = thumb.src;
    imgZoom.src = thumb.src;
  });
});

// efeito lupa
imgPrincipal.addEventListener("mousemove", (e) => {
  lupa.style.display = "block";
  const rect = imgPrincipal.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  lupa.style.left = `${x - lupa.offsetWidth / 2}px`;
  lupa.style.top = `${y - lupa.offsetHeight / 2}px`;

  imgZoom.style.left = `${-x}px`;
  imgZoom.style.top = `${-y}px`;
});

imgPrincipal.addEventListener("mouseleave", () => {
  lupa.style.display = "none";
});
