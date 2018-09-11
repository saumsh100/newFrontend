
export default function renderCSS(defaultColor, maxWidth) {
  return `
    html {
      height: 100%;
    }

    body {
      width:100% !important;
      min-width:100% !important;
      background-color: #EEEEEE !important;
      min-height: 100%;
      padding: 0px !important;
      margin:0 auto;
      font-family: Roboto, sans-serif;
    }
           
    .socialLink {
      background-color: ${defaultColor};
    }
    
    .buttonStyle {
      background-color: ${defaultColor};
      height: 40px !important;
    }
    
    .templateColumns {
      border-top: 10px solid ${defaultColor};
      background-color: #FFFFFF !important;
      max-width: ${maxWidth}px !important;
      width: ${maxWidth}px;
    }
    
    .bottomDefaultText{
      text-decoration: none !important;
      color: #6c6c6c !important;
    }
    
    .buttonContainer{
      cursor: pointer;
    }

    link {
      text-decoration: none !important;
    }

    a:link, #email {
      text-decoration: none !important;
    }

    a:visited {
      text-decoration: none !important;
    }

    a:hover {
      text-decoration: none !important;
    }
    
    .linkTextBold {
      text-decoration: none !important;
      color: #000000 !important;
    }
    
    img {
      display: block;
    }
   
    @media only screen and (max-width: 480px) { 
      .starTable {
         padding: 9px 9px 9px 9px !important;
      }
           
      .star {
        height: 32px !important;
        width: 32px !important;
      }
      
      body {
        width:100% !important;
        min-width:100% !important;
        background-color: #EEEEEE !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      .templateColumns {
        max-width: 100% !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      .buttonContainer {
        width: 300px !important;
      }

      .bottomDefaultText{
        text-decoration: none !important;
        color: #6c6c6c !important;
      }
      
      .buttonStyle {
        font-size: 16px !important;
      }
    }
    
    @media only screen and (max-width: 414px){
      .bottomDefaultText{
        font-size: 12px !important;
      }
      
      .buttonContainer {
        width: 300px !important;
      }
      
      .buttonStyle {
        font-size: 16px !important;
      }

      .largeHeader {
        font-size: 28px !important;
      }
    }

    @media only screen and (max-width: 375px){
      .buttonStyle {
        font-size: 16px !important;
      }

      .bottomDefaultText{
        font-size: 12px !important;
        text-decoration: none !important;
      }
      
      .buttonContainer {
        width: 300px !important;
      }
      
      .buttonStyle {
        font-size: 16px !important;
      }

      .largeHeader {
        font-size: 26px !important;
      }
    }
    
    @media only screen and (max-width: 320px){
      .buttonStyle {
        font-size: 14px !important;
      }
      .bottomDefaultText{
        font-size: 12px !important;
      }
      .subHeader {
        font-size: 14px !important;
      }
      .largeHeader {
        font-size: 26px !important;
      }
    }`;
}
