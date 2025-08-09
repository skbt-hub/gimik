// Fungsi untuk memuat naik gambar dan menukar menjadi puzzle
document.getElementById('imageUpload').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function() {
            createPuzzle(img);
        };
    };
    reader.readAsDataURL(e.target.files[0]);
});

// Fungsi untuk membuat puzzle dengan kepingan
function createPuzzle(img) {
    const pieces = 12; // Bilangan kepingan
    const pieceWidth = img.width / Math.sqrt(pieces);
    const pieceHeight = img.height / Math.sqrt(pieces);
    const container = document.getElementById('puzzle-container');
    container.innerHTML = '';  // Kosongkan grid

    for (let i = 0; i < pieces; i++) {
        let piece = document.createElement("div");
        piece.classList.add("puzzle-piece");
        piece.setAttribute("draggable", true);
        piece.style.backgroundImage = `url(${img.src})`;
        piece.style.backgroundPosition = `${(i % Math.sqrt(pieces)) * pieceWidth}px ${(Math.floor(i / Math.sqrt(pieces))) * pieceHeight}px`;
        piece.style.width = `${pieceWidth}px`;
        piece.style.height = `${pieceHeight}px`;
        piece.dataset.index = i;
        container.appendChild(piece);

        // Membolehkan seret dan lepas
        piece.addEventListener("dragstart", function(e) {
            e.dataTransfer.setData("text", i);
        });

        piece.addEventListener("dragover", function(e) {
            e.preventDefault();
        });

        piece.addEventListener("drop", function(e) {
            const draggedIndex = e.dataTransfer.getData("text");
            const draggedPiece = document.querySelector(`[data-index="${draggedIndex}"]`);
            const targetPiece = e.target;
            const temp = draggedPiece.style.backgroundPosition;
            draggedPiece.style.backgroundPosition = targetPiece.style.backgroundPosition;
            targetPiece.style.backgroundPosition = temp;

            checkPuzzleComplete();
        });
    }
}

// Fungsi untuk memeriksa jika puzzle selesai
function checkPuzzleComplete() {
    const pieces = document.querySelectorAll(".puzzle-piece");
    let complete = true;

    pieces.forEach(piece => {
        if (!piece.style.backgroundPosition) {
            complete = false;
        }
    });

    if (complete) {
        document.getElementById("congrats-message").style.display = "block";
        document.getElementById("audioPlayer").src = document.getElementById("audioUpload").files[0].name;
        document.getElementById("audioPlayer").play();
    }
}

// Fungsi untuk memuat naik lagu dan memainkannya
document.getElementById('audioUpload').addEventListener('change', function(e) {
    const audio = new Audio(URL.createObjectURL(e.target.files[0]));
    audio.play();
});
