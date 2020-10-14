let list = [];
Array.prototype.remove = function () {
	let what;
	const a = arguments;
	let L = a.length;
	let ax;
	while (L && this.length) {
		what = a[--L];
		while ((ax = this.indexOf(what)) !== -1) {
			this.splice(ax, 1);
		}
	}
	return this;
};

const clear = document.querySelector('.clear');
const ulList = document.getElementById('ulList');
const input = document.querySelector('input');
const todoButton = document.querySelector('.todo-button');

const bottomClass = 'bottom';
const checkClass = 'fa-check-square';
const uncheckClass = 'fa-check';
const lineThroughClass = 'lineThrough';

// Clear all the items from LS
clear.addEventListener('click', () => {
	ulList.remove();
	localStorage.clear();
	location.reload();
});

// Create a item with input text, id, and 1 boolean which decide the class for each item for LS
function addText(inputValue, checked) {
	const isDone = checked ? checkClass : uncheckClass;
	const line = checked ? lineThroughClass : '';
	const trash = checked ? '' : 'none';
	const bottom = checked ? 'bottom' : '';

	const text = `<li class="todoItem ${bottom}">
      <i class="fas ${isDone}"  attr="complete"></i>
      <p class="text ${line}">${inputValue}</p>
      <i class="fas fa-trash" style="display: ${trash}"id="trash"attr="remove"></i>
    </li>`;

	ulList.innerHTML += text;
}

// LOCAL STORAGE
const loadToDo = (array) => {
	array.forEach((item) => addText(item.name, item.checked));
};

// GET ITEM FROM LS
const data = localStorage.getItem('TODO');
if (data) {
	list = JSON.parse(data);
	loadToDo(list);
} else {
	list = [];
}

// ADD TO THE LIST by Click Button
todoButton.addEventListener('click', (e) => {
	e.preventDefault();
	if (!input.value || input.value === ' ' || input.value.length < 1) {
		return;
	}
	addText(input.value, false);
	list.push({
		name: input.value,
		checked: false,
	});
	localStorage.setItem('TODO', JSON.stringify(list));
	input.value = '';
});

// ADD TO THE LIST by ENTER KEY
input.addEventListener('keyup', (e) => {
	if (e.keyCode === 13) {
		if (!input.value || input.value === ' ') {
			return;
		}
		addText(input.value, false);
		list.push({
			name: input.value,
			checked: false,
		});
		localStorage.setItem('TODO', JSON.stringify(list));
		input.value = '';
	}
});

function completeToDo(e) {
	const doneCheck = list.find(
		(item) => item.name === e.parentElement.children[1].textContent
	);
	e.classList.toggle(checkClass);
	e.classList.toggle(uncheckClass);
	e.parentNode.querySelector('.text').classList.toggle(lineThroughClass);
	e.parentNode.querySelector('#trash').style.display =
		e.parentNode.querySelector('#trash').style.display === 'none' ? '' : 'none';
	e.parentNode.classList.toggle(bottomClass);
	// if item is checked, leave on true, else put to false
	doneCheck.checked = !doneCheck.checked;
}

function removeItem(e) {
	const toDelete = list.find(
		(item) => item.name === e.parentElement.children[1].textContent
	);
	e.parentNode.remove();
	list.remove(toDelete);
}

ulList.addEventListener('click', (e) => {
	const elementTarget = e.target;
	const attribute = e.target.attributes.attr.value;
	if (attribute === 'complete') {
		completeToDo(elementTarget);
	} else if (attribute === 'remove') {
		removeItem(elementTarget);
	}
	localStorage.setItem('TODO', JSON.stringify(list));
});
