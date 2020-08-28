const Mask = {
    apply ( input, func ) {
        setTimeout ( () => {
            input.value = Mask[func]( input.value ) 
        }, 0)
    },
    formatBRL ( value ) {
        value = value.replace (/\D/g, "")

        return new Intl.NumberFormat ('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format ( value/100 ) 
    }
}

const photosUpload = {
    input: "",
    preview: document.querySelector ('#photos-preview'),
    uploadLimit: 6,
    files: [],
    handleFile ( event ) {
        const { files: fileList } = event.target  
        photosUpload.input = event.target

        if ( photosUpload.hasLimit ( event ) ) return 

        Array.from ( fileList ).forEach ( file => {

            photosUpload.files.push ( file )

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String ( reader.result )

                const container = photosUpload.getContainer ( image )

                photosUpload.preview.appendChild ( container )
            }

            reader.readAsDataURL ( file )
        })

        photosUpload.input.files = photosUpload.getAllFiles()
    },
    hasLimit ( event ) {
        const { uploadLimit, input, preview } = photosUpload
        const { files: fileList } = input

        if ( fileList.length > uploadLimit ) {
            alert (`Envie no máximo ${ uploadLimit } fotos`)
            event.preventDefault()
            
            return true
        }

        const imageDiv = []
        preview.childNodes.forEach ( item => {
            if ( item.classList && item.classList.value == 'photo') {
                imageDiv.push ( item )
            }
        })

        const totalImage = fileList.length + imageDiv.length
        if ( totalImage > uploadLimit ) {
            const rest = uploadLimit - imageDiv.length
            if ( rest > 1 ) {
                alert (`Coloque mais ${ rest } fotos.`)
            } else if ( rest == 1 ) {
                alert (`Coloque mais ${ rest } foto.`)
            } else {
                alert (`Você atingiu o limite de fotos!`)
            }
            event.preventDefault()
            return true 
        }

        return false 
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent ("").clipboardData || new DataTransfer()

        photosUpload.files.forEach ( file => dataTransfer.items.add ( file ))

        return dataTransfer.files
    },
    getContainer ( image ){
        const container = document.createElement ('div')
        container.classList.add ('photo')

        container.onclick = photosUpload.removeImage
        container.appendChild ( image )

        container.appendChild ( photosUpload.getRemoveButton() )

        return container
    },
    getRemoveButton() {
        const button = document.createElement ('i')
        button.classList.add ('material-icons')
        button.innerHTML = 'close'
        return button
    },
    removeImage ( event ) {
        const imageContainer = event.target.parentNode // <div class="photo">
        const imageArray = Array.from ( photosUpload.preview.children )
        const index = imageArray.lastIndexOf ( imageContainer )

        photosUpload.files.splice (index, 1)
        photosUpload.input.files = photosUpload.getAllFiles()

        imageContainer.remove()
    }
}