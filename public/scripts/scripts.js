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
    },
    cpfCnpj(value) {
        value = value.replace (/\D/g, "")

        if(value.length > 14) value = value.slice(0, -1)

        // Verificando se é CPF ou CNPJ
        if(value.length > 11) {
            // 11.222.333/4444-55
            value = value.replace(/(\d{2})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1/$2')
            value = value.replace(/(\d{4})(\d)/, '$1-$2')

        } else {
            // 111.222.333-44
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1-$2')

        }

        return value
    },
    cep(value) {
        // 12345-678
        value = value.replace (/\D/g, "")

        if(value.length > 8) value = value.slice(0, -1)
        
        value = value.replace(/(\d{5})(\d)/, '$1-$2')
        
        return value
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
        button.innerHTML = 'delete'
        return button
    },
    removeImage ( event ) {
        const imageContainer = event.target.parentNode // <div class="photo">
        const imageArray = Array.from ( photosUpload.preview.children )
        const index = imageArray.lastIndexOf ( imageContainer )

        photosUpload.files.splice (index, 1)
        photosUpload.input.files = photosUpload.getAllFiles()

        imageContainer.remove()
    },
    removeOldImage ( event ) {
        const photoDiv = event.target.parentNode

        if ( photoDiv.id ) {
            const removedFiles = document.querySelector ('input[name="removed_files"]')
            if ( removedFiles ) removedFiles.value += `${ photoDiv.id },`
        }

        photoDiv.remove()
    }
}

const imageGallery = {
    hightlight: document.querySelector ('.gallery .highlight > img'),
    previews: document.querySelectorAll ('.gallery-preview img'),
    setImage ( event ) {
        const { target } = event 

        imageGallery.previews.forEach ( preview => preview.classList.remove ('active'))
        target.classList.add ('active')

        imageGallery.hightlight.src = target.src 
        lightbox.image.src = target.src 
    }
}

const lightbox = {
    target: document.querySelector ('.lightbox-target'),
    image: document.querySelector ('.lightbox-target img'),
    closeButton: document.querySelector ('.lightbox-target a.lightbox-close'),
    open() {
        lightbox.target.style.opacity = 1
        lightbox.target.style.top = 0
        lightbox.closeButton.style.top = 0
    },
    close() {
        lightbox.target.style.opacity = 0
        lightbox.target.style.top = "-100%"
        lightbox.closeButton.style.top = "-80px"
    }
} 

const Validate = {
    apply ( input, func ) {
        Validate.clearErrors(input)

        let results = Validate[func](input.value) 
        input.value = results.value

        if(results.error) Validate.displayError(input, results.error)
    },
    displayError(input, error) {
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        
        input.focus()
    },
    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector('.error')
        if(errorDiv) errorDiv.remove()
    },
    isEmail(value) {
        let error = null
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if(!value.match(mailFormat)) error = "Email Inválido"

        return {
            error,
            value
        }
    },
    isCpfCnpj(value) {
        let error = null

        const cleanValues = value.replace (/\D/g, "")
        if(cleanValues.length > 11 && cleanValues.length !== 14) {
            error = "CNPJ Inválido"
        } else if (cleanValues.length < 12 && cleanValues.length !== 11) {
            error = "CPF Inválido"
        }

        return {
            error, 
            value
        }
    },
    isCep (value) {
        let error = null

        const cleanValues = value.replace (/\D/g, "")
        if(cleanValues.length !== 8) {
            error = "CEP Inválido"
        }

        return {
            error,
            value
        }
    },
    allFields(e) {
        const items = document.querySelectorAll('.item input, .item select, .item textarea')

        for(item of items) {
            if(item.value == '') {
                const message = document.createElement('div')
                message.classList.add('messages')
                message.classList.add('error')
                message.style.position = 'fixed'
                message.innerHTML = 'Todos os campos são obrigatórios.'
                document.querySelector('body').append(message) 
                e.preventDefault()
                break
            }
        }
    }
}