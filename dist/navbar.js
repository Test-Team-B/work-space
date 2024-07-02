// navbarのoptionsとoptinos要素
const optionsNavbar = document.getElementById('navbar__options');
const options = document.getElementById('options');

// navbarのName Settingsとname-setting要素
const navbarNameSettings = document.getElementById('navbar__name-settings');
const nameSetting = document.getElementById('name-setting');

// name-settings、optionsのバツボタン要素
const nameSettingCloseBtn = document.getElementById('name-setting__btn-close');
const optionsCloseBtn = document.getElementById('options__btn-close');

// navbarのoptionsが押された時
optionsNavbar.addEventListener('click',() => {
  if (nameSetting.classList.contains('d-flex')) { 
    nameSetting.classList.remove('d-flex');
    nameSetting.classList.add('d-none');
  }

  if (options.classList.contains('d-none')) {
    options.classList.remove('d-none');
    options.classList.add('d-flex');
  } else {
    options.classList.remove('d-flex');
    options.classList.add('d-none');
  }
});

// navbarのName Settingsが押された時
navbarNameSettings.addEventListener('click',() => {
  if (options.classList.contains('d-flex')) {
    options.classList.remove('d-flex');
    options.classList.add('d-none');
  }

  if (nameSetting.classList.contains('d-none')) {
    nameSetting.classList.remove('d-none');
    nameSetting.classList.add('d-flex');
  } 
  
  else {
    nameSetting.classList.remove('d-flex');
    nameSetting.classList.add('d-none');
  }
});

// Name Settingsのclose buttonが押された時
nameSettingCloseBtn.addEventListener('click', () => {
  if (nameSetting.classList.contains('d-none')) {
    nameSetting.classList.remove('d-none');
    nameSetting.classList.add('d-flex');
  } 
  
  else {
    nameSetting.classList.remove('d-flex');
    nameSetting.classList.add('d-none');
  }
});

// Optionsのclose buttonが押された時
optionsCloseBtn.addEventListener('click', () => {
  if (options.classList.contains('d-none')) {
    options.classList.remove('d-none');
    options.classList.add('d-flex');
  } 
  
  else {
    options.classList.remove('d-flex');
    options.classList.add('d-none');
  }
});