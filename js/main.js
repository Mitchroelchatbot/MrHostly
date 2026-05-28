// MR HOSTLY - Shared JavaScript

document.addEventListener('DOMContentLoaded', () => {

  // Hamburger menu toggle
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      navMobile.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Sluit menu bij klik op link
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

});
