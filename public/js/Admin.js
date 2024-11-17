document.getElementById('fileInput').addEventListener('change',function(event){
  const file = event.target.files[0];
  if(file) {
    const reader = new FileReader();
    reader.onload = function(e){
      const img = document.createElement('img');
      img.src = e.target.result;
      document.getElementById('preview').innerHTML = '';
      document.getElementById('preview').appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('uploadForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const formData = new FormData();
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  const type = document.getElementById('type').value;
  const price = document.getElementById('price').value;
  const colour = document.getElementById('colour').value;
  const age = document.getElementById('age').value;
  const collection = document.getElementById('collection').value;
  const priority = document.getElementById('priority').value;
  const imageName = type + colour + age + collection + priority;

  if (file && imageName) {
    formData.append('newName', imageName);
    formData.append('type', type);
    formData.append('price', price);
    formData.append('colour', colour);
    formData.append('age', age);
    formData.append('collection', collection);
    formData.append('priority', priority);
    formData.append('image', file);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
        headeres: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.ok) {
        alert('Image uploaded successfully!');
      } else {
        alert('Image upload failed!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Image upload failed!');
    }
  } else {
    alert('Please select an image');
  }
});

