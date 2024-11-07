bookButton = document.getElementById('bookButton');
modal = document.getElementById('modal');
closeModal = document.getElementById('close');

bookButton.addEventListener('click', function() {
    modal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
});