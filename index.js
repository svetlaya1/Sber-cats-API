console.log("work");


const $wr = document.querySelector('[data-wr]')
const $wr2 = document.querySelector('[data-wr2]')
const $wr3 = document.querySelector('[data-wr3]')

const $modalWr = document.querySelector('[data-modalWr]')
const $modalWr2 = document.querySelector('[data-modalWr2]')
const $modalWr3 = document.querySelector('[data-modalWr3]')
const $modalContent = document.querySelector('[data-modalContent]')
const $modalContent2 = document.querySelector('[data-modalContent2]')
const $modalContent3 = document.querySelector('[data-modalContent3]')
const $catCreateFormTemplate = document.getElementById('createCatForm')
const $catInfoFormTemplate = document.getElementById('infoCatForm')
const $catRemoveFormTemplate = document.getElementById('removeCatForm')

const CREATE_FORM_LS_KEY = 'CREATE_FORM_LS_KEY'
const INFO_FORM_LS_KEY = 'INFO_FORM_LS_KEY'
const REMOVE_FORM_LS_KEY = 'REMOVE_FORM_LS_KEY'

const ACTIONS = {
    DETAIL: 'detail',
    DELETE: 'delete',
    REMOVE: 'remove'
}



//Получить информацию о котах

const getCatHTML = (cat) => {
    return `
        <div data-cat-id="${cat.id}" class="card">
            <img src="${cat.image}" class="card__img" alt="${cat.name}">
            <div class="card__body">
                <h5 class="card__title">${cat.name}</h5>
                <button data-action="${ACTIONS.DETAIL}" data-openModal="infoCat" type="button" class="card__btn1">Подробнее</button>
                <button data-action="${ACTIONS.REMOVE}" data-openModal="removeCat" type="button" class="card__btn3">Изменить</button>
                <button data-action="${ACTIONS.DELETE}" type="button" class="card__btn2">Удалить</button>
            </div>
        </div>
    `
}

fetch('https://cats.petiteweb.dev/api/single/svetlaya1/show/')
    .then((res) => res.json())
.then((data) => {

        $wr.insertAdjacentHTML('afterbegin', data.map(cat => getCatHTML(cat)).join(''))


        console.log({data})
    
})



//Удаление котика

$wr.addEventListener('click', (e) => {
    if (e.target.dataset.action === ACTIONS.DELETE) {
      const $catWr = e.target.closest('[data-cat-id]')
      const catId = $catWr.dataset.catId
  
      fetch(`https://cats.petiteweb.dev/api/single/svetlaya1/delete/${catId}`, {
        method: 'DELETE',
      }).then((res) => {
        if (res.status === 200) {
          return $catWr.remove()
        }
  
        alert(`Ошибка удаления котика с id = ${catId}`)
      })
    }
  })



//Модалка добавить кота

const formatCreateFormData = (formDataObject) => ({
  ...formDataObject,
  id: +formDataObject.id,
  rate: +formDataObject.rate,
  age: +formDataObject.age,
  favorite: !!formDataObject.favorite,
})

const clickModalWrHandler = (e) => {
  if (e.target === $modalWr) {
    $modalWr.classList.add('hidden')
    $modalWr.removeEventListener('click', clickModalWrHandler)
    $modalContent.innerHTML = ''
  }
}

const openModalHandler = (e) => {
  const targetModalName = e.target.dataset.openmodal

  if (targetModalName === 'createCat') {
    $modalWr.classList.remove('hidden')
    $modalWr.addEventListener('click', clickModalWrHandler)


    const cloneCatCreateForm = $catCreateFormTemplate.content.cloneNode(true)
    $modalContent.appendChild(cloneCatCreateForm)

    const $createCatForm = document.forms.createCatForm

    const dataFromLS = localStorage.getItem(CREATE_FORM_LS_KEY)

    const preparedDataFromLS = dataFromLS && JSON.parse(dataFromLS)

    if (preparedDataFromLS) {
      Object.keys(preparedDataFromLS).forEach((key) => {
        $createCatForm[key].value = preparedDataFromLS[key]
      })
    }

    $createCatForm.addEventListener('submit', (submitEvent) => {
      submitEvent.preventDefault()

      const formDataObject = formatCreateFormData(
        Object.fromEntries(new FormData(submitEvent.target).entries()),
      )

      fetch('https://cats.petiteweb.dev/api/single/svetlaya1/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObject),
      }).then((res) => {
        if (res.status === 200) {
          $modalWr.classList.add('hidden')
          $modalWr.removeEventListener('click', clickModalWrHandler)
          $modalContent.innerHTML = ''

          localStorage.removeItem(CREATE_FORM_LS_KEY)
          return $wr.insertAdjacentHTML(
            'afterbegin',
            getCatHTML(formDataObject),
          )
        }
        throw Error('Ошибка при создании кота (проверьте уникальность id)')
      }).catch(alert)
    })
    $createCatForm.addEventListener('change', () => {
      const formattedData = formatCreateFormData(
        Object.fromEntries(new FormData($createCatForm).entries()),
      )

      localStorage.setItem(CREATE_FORM_LS_KEY, JSON.stringify(formattedData))
    })
  }
}

document.addEventListener('click', openModalHandler)

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    $modalWr.classList.add('hidden')
    $modalWr.removeEventListener('click', clickModalWrHandler)
    $modalContent.innerHTML = ''
  }
})

//Модалка открыть инфо о коте


const formatInfoFormData = (formDataObject) => ({
  ...formDataObject,
  id: +formDataObject.id,
  rate: +formDataObject.rate,
  age: +formDataObject.age,
  favorite: !!formDataObject.favorite,
})

const clickModalWrHandler2 = (e) => {
  if (e.target === $modalWr2) {
    $modalWr2.classList.add('hidden')
    $modalWr2.removeEventListener('click', clickModalWrHandler2)
    $modalContent2.innerHTML = ''
  }
}

const openModalHandler2 = (e) => {
  const targetModalName = e.target.dataset.openmodal

  if (targetModalName === 'infoCat') {
    $modalWr2.classList.remove('hidden')
    $modalWr2.addEventListener('click', clickModalWrHandler2)

    const getCatHTMLInfo = (cat) => {
      const $catWr = e.target.closest('[data-cat-id]')
      const catId = $catWr.dataset.catId

      if (cat.id == catId) {
      return `
          <div data-cat-id="${cat.id}" class="card card__info">
              <img src="${cat.image}" class="card__img" alt="${cat.name}">
              <div class="card__body">
                  <h5 class="card__title">${cat.name}</h5>
                  <p class="card__text">${cat.description}</p>
                  <p class="card__text">Возраст:&nbsp${cat.age}</p>
                  <p class="card__text">Рейтинг:&nbsp${cat.rate}</p>
                  <p class="card__text">Любимчик:&nbsp${cat.favorite}</p>
              </div>
          </div>
      `;
      } 
    }

    fetch('https://cats.petiteweb.dev/api/single/svetlaya1/show/')
    .then((res) => res.json())
    .then((data) => {

      $wr2.insertAdjacentHTML('afterbegin', data.map(cat => getCatHTMLInfo(cat)).join(''))


      console.log({data})
    })
  }
}

document.addEventListener('click', openModalHandler2)

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    $modalWr2.classList.add('hidden')
    $modalWr2.removeEventListener('click', clickModalWrHandler2)
    $modalContent2.innerHTML = ''
  }
})



//Модалка изменить кота

const formatRemoveFormData = (formDataObject) => ({
  ...formDataObject,
  id: +formDataObject.id,
  rate: +formDataObject.rate,
  age: +formDataObject.age,
  favorite: !!formDataObject.favorite,
})

const clickModalWrHandler3 = (e) => {
  if (e.target === $modalWr3) {
    $modalWr3.classList.add('hidden')
    $modalWr3.removeEventListener('click', clickModalWrHandler3)
    $modalContent3.innerHTML = ''
  }
}

const openModalHandler3 = (e) => {
  const targetModalName = e.target.dataset.openmodal


  if (targetModalName === 'removeCat') {
    $modalWr3.classList.remove('hidden')
    $modalWr3.addEventListener('click', clickModalWrHandler3)

    const cloneCatRemoveForm = $catRemoveFormTemplate.content.cloneNode(true)
    $modalContent3.appendChild(cloneCatRemoveForm)

    const $removeCatForm = document.forms.removeCatForm

    const dataFromLS = localStorage.getItem(REMOVE_FORM_LS_KEY)

    const preparedDataFromLS = dataFromLS && JSON.parse(dataFromLS)


    if (preparedDataFromLS) {
      Object.keys(preparedDataFromLS).forEach((key) => {
        $removeCatForm[key].value = preparedDataFromLS[key]
      })
    }

    $removeCatForm.addEventListener('submit', (submitEvent) => {
      submitEvent.preventDefault()

      const formDataObject = formatRemoveFormData(
        Object.fromEntries(new FormData(submitEvent.target).entries()),
      )


      fetch('https://cats.petiteweb.dev/api/single/svetlaya1/add/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObject),
      }).then((res) => {
        if (res.status === 200) {
          $modalWr3.classList.add('hidden')
          $modalWr3.removeEventListener('click', clickModalWrHandler3)
          $modalContent3.innerHTML = ''

          localStorage.removeItem(REMOVE_FORM_LS_KEY)
          return $wr3.insertAdjacentHTML(
            'afterbegin',
            getCatHTML(formDataObject),
          )
        }
      }).catch(alert)
    })
    $removeCatForm.addEventListener('change', () => {
      const formattedData = formatRemoveFormData(
        Object.fromEntries(new FormData($removeCatForm).entries()),
      )

      localStorage.setItem(REMOVE_FORM_LS_KEY, JSON.stringify(formattedData))
    })
  }
}
document.addEventListener('click', openModalHandler3)

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    $modalWr3.classList.add('hidden')
    $modalWr3.removeEventListener('click', clickModalWrHandler3)
    $modalContent3.innerHTML = ''
  }
})