function handleSubmit() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
const type=document.getElementById('select-file-type').value;
alert(type);
  if (!file) {
    alert("Please select a file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const fileContent = event.target.result;

    localStorage.setItem("fileContent", fileContent);
    if(type=='event'){
    window.location.href = "display.html";}
  };

  reader.readAsText(file);
}
