document.getElementById('eventForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Simulate registration success
    document.getElementById('successMsg').style.display = 'block';

    // Optionally, clear form
    this.reset();

    // Hide message after 4 seconds
    setTimeout(() => {
      document.getElementById('successMsg').style.display = 'none';
    }, 4000);
  });