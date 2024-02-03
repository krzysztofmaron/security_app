document.addEventListener('DOMContentLoaded', function(){

    const tabButtons = document.querySelectorAll('.tab-container')

    tabButtons.forEach(e => {
        e.addEventListener('click', function(){
            if(!e.classList.contains('active')){
                const redirect_url = e.classList[1]
                window.location.href = redirect_url
            }
            
        })
    })
    
    const panelButton = document.querySelector('.panel-container')
    panelButton.addEventListener('click', function(){
        if(panelButton.classList.contains('authenticated')){
            window.location.href = 'admin'
        }
    })

})