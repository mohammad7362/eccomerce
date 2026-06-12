console.clear()

let id = location.search.split('?')[1]
console.log(id)

function getCartState()
{
    let savedCart = localStorage.getItem('shoplaneCart')
    if(savedCart)
    {
        try
        {
            return JSON.parse(savedCart)
        }
        catch(error)
        {
            console.log(error)
        }
    }

    if(document.cookie.indexOf(',counter=')>=0)
    {
        let cookieParts = document.cookie.split(',')
        return {
            orderId: cookieParts[0].split('=')[1],
            counter: Number(cookieParts[1].split('=')[1])
        }
    }

    return { orderId: '', counter: 0 }
}

let cartState = getCartState()
document.getElementById("badge").innerHTML = cartState.counter

function dynamicContentDetails(ob)
{
    let mainContainer = document.createElement('div')
    mainContainer.id = 'containerD'
    document.getElementById('containerProduct').appendChild(mainContainer);

    let imageSectionDiv = document.createElement('div')
    imageSectionDiv.id = 'imageSection'

    let imgTag = document.createElement('img')
     imgTag.id = 'imgDetails'
     //imgTag.id = ob.photos
     imgTag.src = ob.preview

    imageSectionDiv.appendChild(imgTag)

    let imageHint = document.createElement('div')
    imageHint.id = 'imageHint'
    imageHint.textContent = 'Hover to magnify details'
    imageSectionDiv.appendChild(imageHint)

    let magnifierLens = document.createElement('div')
    magnifierLens.id = 'imageMagnifier'
    imageSectionDiv.appendChild(magnifierLens)

    let imageZoom = 2.2
    let lensSize = 180

    function updateMagnifier(event)
    {
        let rect = imgTag.getBoundingClientRect()
        let cursorX = event.clientX - rect.left
        let cursorY = event.clientY - rect.top

        if(cursorX < 0 || cursorY < 0 || cursorX > rect.width || cursorY > rect.height)
        {
            magnifierLens.style.display = 'none'
            return
        }

        let halfLens = lensSize / 2
        let lensX = Math.max(halfLens, Math.min(rect.width - halfLens, cursorX)) - halfLens
        let lensY = Math.max(halfLens, Math.min(rect.height - halfLens, cursorY)) - halfLens

        magnifierLens.style.display = 'block'
        magnifierLens.style.left = lensX + 'px'
        magnifierLens.style.top = lensY + 'px'
        magnifierLens.style.width = lensSize + 'px'
        magnifierLens.style.height = lensSize + 'px'
        magnifierLens.style.backgroundImage = 'url(' + imgTag.src + ')'
        magnifierLens.style.backgroundRepeat = 'no-repeat'
        magnifierLens.style.backgroundSize = (rect.width * imageZoom) + 'px ' + (rect.height * imageZoom) + 'px'
        magnifierLens.style.backgroundPosition = '-' + ((cursorX * imageZoom) - halfLens) + 'px -' + ((cursorY * imageZoom) - halfLens) + 'px'
    }

    imgTag.addEventListener('mouseenter', function(event)
    {
        imageHint.classList.add('visible')
        updateMagnifier(event)
    })

    imgTag.addEventListener('mousemove', updateMagnifier)

    imgTag.addEventListener('mouseleave', function()
    {
        magnifierLens.style.display = 'none'
        imageHint.classList.remove('visible')
    })

    let productDetailsDiv = document.createElement('div')
    productDetailsDiv.id = 'productDetails'

    // console.log(productDetailsDiv);

    let h1 = document.createElement('h1')
    let h1Text = document.createTextNode(ob.name)
    h1.appendChild(h1Text)

    let h4 = document.createElement('h4')
    let h4Text = document.createTextNode(ob.brand)
    h4.appendChild(h4Text)
    console.log(h4);

    let detailsDiv = document.createElement('div')
    detailsDiv.id = 'details'

    let h3DetailsDiv = document.createElement('h3')
    let h3DetailsText = document.createTextNode('$ ' + ob.price)
    h3DetailsDiv.appendChild(h3DetailsText)

    let h3 = document.createElement('h3')
    let h3Text = document.createTextNode('Description')
    h3.appendChild(h3Text)

    let para = document.createElement('p')
    let paraText = document.createTextNode(ob.description)
    para.appendChild(paraText)

    let productPreviewDiv = document.createElement('div')
    productPreviewDiv.id = 'productPreview'

    let h3ProductPreviewDiv = document.createElement('h3')
    let h3ProductPreviewText = document.createTextNode('Product Preview')
    h3ProductPreviewDiv.appendChild(h3ProductPreviewText)
    productPreviewDiv.appendChild(h3ProductPreviewDiv)

    let i;
    for(i=0; i<ob.photos.length; i++)
    {
        let imgTagProductPreviewDiv = document.createElement('img')
        imgTagProductPreviewDiv.id = 'previewImg'
        imgTagProductPreviewDiv.src = ob.photos[i]
        imgTagProductPreviewDiv.onclick = function(event)
        {
            console.log("clicked" + this.src)
            document.getElementById("imgDetails").src = this.src 
            magnifierLens.style.backgroundImage = 'url(' + this.src + ')'
            
        }
        productPreviewDiv.appendChild(imgTagProductPreviewDiv)
    }

    let buttonDiv = document.createElement('div')
    buttonDiv.id = 'button'

    let buttonTag = document.createElement('button')
    buttonDiv.appendChild(buttonTag)

    buttonText = document.createTextNode('Add to Cart')
    buttonTag.onclick  =   function()
    {
        let order = id+" "
        let counter = 1
        let currentState = getCartState()
        if(currentState.counter > 0)
        {
            order = id + " " + currentState.orderId
            counter = Number(currentState.counter) + 1
        }
        try
        {
            localStorage.setItem('shoplaneCart', JSON.stringify({ orderId: order.trim(), counter: counter }))
        }
        catch(error)
        {
            console.log(error)
        }
        document.cookie = "orderId=" + order + ",counter=" + counter
        document.getElementById("badge").innerHTML = counter
        console.log(document.cookie)
    }
    buttonTag.appendChild(buttonText)


    console.log(mainContainer.appendChild(imageSectionDiv));
    mainContainer.appendChild(imageSectionDiv)
    mainContainer.appendChild(productDetailsDiv)
    productDetailsDiv.appendChild(h1)
    productDetailsDiv.appendChild(h4)
    productDetailsDiv.appendChild(detailsDiv)
    detailsDiv.appendChild(h3DetailsDiv)
    detailsDiv.appendChild(h3)
    detailsDiv.appendChild(para)
    productDetailsDiv.appendChild(productPreviewDiv)
    
    
    productDetailsDiv.appendChild(buttonDiv)


    return mainContainer
}



// BACKEND CALLING

let httpRequest = new XMLHttpRequest()
{
    httpRequest.onreadystatechange = function()
    {
        if(this.readyState === 4 && this.status == 200)
        {
            console.log('connected!!');
            let contentDetails = JSON.parse(this.responseText)
            {
                console.log(contentDetails);
                dynamicContentDetails(contentDetails)
            }
        }
        else
        {
            console.log('not connected!');
        }
    }
}

httpRequest.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product/'+id, true)
httpRequest.send()  
