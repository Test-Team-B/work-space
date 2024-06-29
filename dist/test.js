const optionsNavbar = document.getElementById('navbar__options');
const options = document.getElementById('options');

optionsNavbar.addEventListener('click',()=>{
  if (options.classList.contains('d-none')) {
    options.classList.remove('d-none');
    options.classList.add('d-flex');
  }

  else {
    options.classList.remove('d-flex');
    options.classList.add('d-none');
  }
});

const navbarNameSettings = document.getElementById('navbar__name-settings');
const nameSetting = document.getElementById('name-setting');

navbarNameSettings.addEventListener('click',()=>{

  if (nameSetting.classList.contains('d-none')) {
    nameSetting.classList.remove('d-none');
    nameSetting.classList.add('d-flex');
  }

  else {
    nameSetting.classList.remove('d-flex');
    nameSetting.classList.add('d-none');
  }
});

const nameSettingBtn = document.getElementById('name-setting__btn-close');
nameSettingBtn.addEventListener('click', () => {
  if (nameSetting.classList.contains('d-none')) {
    nameSetting.classList.remove('d-none');
    nameSetting.classList.add('d-flex');
  }

  else {
    nameSetting.classList.remove('d-flex');
    nameSetting.classList.add('d-none');
  }
});

const optionsBtn = document.getElementById('options__btn-close');
optionsBtn.addEventListener('click', () => {
  if (options.classList.contains('d-none')) {
    options.classList.remove('d-none');
    options.classList.add('d-flex');
  }

  else {
    options.classList.remove('d-flex');
    options.classList.add('d-none');
  }
});