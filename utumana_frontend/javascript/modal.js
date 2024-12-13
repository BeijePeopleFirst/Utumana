/**
 * 
 */
function createModal(content, onConfirm, color, onCancel) {
    const modal = document.createElement('div');
    modal.id = 'myModal';
    modal.classList.add('modal');
    modal.style.display = 'block';

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalContent.id = 'modal-content';
    modalContent.style.maxWidth = '290px';

    const closeSpan = document.createElement('span');
    closeSpan.classList.add('close');
    closeSpan.innerHTML = '&times;';
    closeSpan.onclick = () => {
        modal.style.display = 'none';
        if (onCancel) onCancel();
    };
    modalContent.appendChild(closeSpan);
	
	content.style.textAlign = 'center';
	modalContent.appendChild(content);
	
    
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirm';
    confirmButton.classList.add('confirm');
    confirmButton.style.backgroundColor = color;
    confirmButton.onclick = () => {
        if (onConfirm) onConfirm();
        modal.style.display = 'none';
    };

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Back';
    cancelButton.classList.add('cancel');
    cancelButton.onclick = () => {
        modal.style.display = 'none';
        if (onCancel) onCancel();
    };

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('action');
    buttonsDiv.appendChild(confirmButton);
    buttonsDiv.appendChild(cancelButton);
    modalContent.appendChild(buttonsDiv);
    
    
    modal.appendChild(modalContent);

    modal.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            if (onCancel) onCancel();
        }
    };

    document.body.appendChild(modal);

    return modal;
}
