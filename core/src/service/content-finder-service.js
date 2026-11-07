//service para buscar os conteudos da pagina

export class ContentFinderService {
  constructor(blocoAnuncio) {
    this.blocoAnuncio = blocoAnuncio;
    this.paginaHost = location.hostname;
  }

  buscaEenviaConteudo() {
    const conteudo = this.findContent();
    this.sendContent(conteudo);
  }

  findContent() {
    var retorno = [];
    retorno = this.blocoAnuncio.querySelectorAll('iframe[src],img[src],script[src]').forEach((elemento) => {
      retorno.push(elemento);
      let host;
      try{
      host = new URL(elemento.src).hostname;
    } catch (error) {
      return;
    }
    if(host === this.paginaHost || host.endsWith('.' + this.paginaHost)) return;
 
    });
    console.log(retorno);
  };

sendContent(content) {
  //envia o conteudo para o navegador

  content.forEach((elemento) => {
    chrome.runtime.sendMessage({
      type: 'content',
      content: elemento.outerHTML,
    });
  });

  
}
}
