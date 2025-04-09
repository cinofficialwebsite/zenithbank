document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("camera");
  const faceFrame = document.getElementById("faceFrame");
  const captureBtn = document.getElementById("captureBtn");
  const previewImage = document.getElementById("previewImage");
  const canvas = document.getElementById("canvas");
  const proceedBtn = document.getElementById("proceedBtn");
  const imageUpload = document.getElementById("imageUpload");

  // Clear previous selfie from localStorage on refresh
  localStorage.removeItem("userSelfie");

  // Open the camera automatically
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "user" } })
    .then((stream) => {
      video.srcObject = stream;
      captureBtn.removeAttribute("disabled"); // Enable capture button
    })
    .catch((err) => {
      Swal.fire({
        icon: "error",
        title: "Camera Access Denied",
        text: "Please allow camera access to continue.",
      });
      console.error("Camera access error:", err);
    });

  // Capture Image from Camera
  captureBtn.addEventListener("click", function () {
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg");
    previewImage.src = imageData;
    previewImage.style.display = "block";

    // Save to localStorage
    localStorage.setItem("userSelfie", imageData);

    Swal.fire({
      icon: "success",
      title: "Image Captured!",
      text: "Your face has been successfully captured.",
    });

    proceedBtn.removeAttribute("disabled"); // Enable proceed button
  });

  // Upload Image from File
  imageUpload.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";

        localStorage.setItem("userSelfie", e.target.result);

        Swal.fire({
          icon: "success",
          title: "Image Uploaded!",
          text: "Your selfie has been uploaded successfully.",
        });

        proceedBtn.removeAttribute("disabled"); // Enable proceed button
      };
      reader.readAsDataURL(file);
    }
  });

  // Proceed Button Functionality
  proceedBtn.addEventListener("click", function () {
    if (localStorage.getItem("userSelfie")) {
      window.location.href = "next-step.html"; // Change to your actual next page
    } else {
      Swal.fire({
        icon: "warning",
        title: "No Image Found",
        text: "Please capture or upload an image first.",
      });
    }
  });
});
