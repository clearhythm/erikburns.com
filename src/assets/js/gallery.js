// Screenshot gallery — thumbnail picker
document.querySelectorAll('.screenshot-gallery').forEach(gallery => {
  const main = gallery.querySelector('.screenshot-main');
  gallery.querySelectorAll('.screenshot-thumb').forEach(thumb => {
    thumb.addEventListener('click', function() {
      main.src = this.src;
      gallery.querySelectorAll('.screenshot-thumb').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('.lightbox-img');

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.screenshot-main').forEach(img => {
  img.addEventListener('click', () => openLightbox(img.src));
});

lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
