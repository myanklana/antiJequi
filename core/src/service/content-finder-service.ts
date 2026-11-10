//service para buscar os conteudos da pagina

export class ContentFinderService {
  blocoAnuncio: ParentNode;
  paginaHost: string;
  constructor(blocoAnuncio:ParentNode) {
    this.blocoAnuncio = blocoAnuncio;
    this.paginaHost = location.hostname;
  }

  buscaEenviaConteudo() {
    const conteudo = this.findContent();
    this.sendContent(conteudo);
  }

  findContent() {
    var retorno:Element[]= [];
    this.blocoAnuncio.querySelectorAll('iframe[src],img[src],script[src]').forEach((elemento: Element) => {
      
      let host;
      try{
      if(elemento.getAttribute('src') != null){
      host = new URL(elemento.getAttribute('src')!).hostname;
      retorno.push(elemento);
      }
      else{
        throw new Error('Elemento sem src');
      }
    } catch (error) {
      throw new Error('Erro ao obter o host do elemento: ' + error);
    }
    if(host === this.paginaHost || host.endsWith('.' + this.paginaHost)) return;
 
    });
    console.log(retorno);
    return retorno;
  };

sendContent(content:Element[]) {
  //envia o conteudo para o navegador

  content.forEach((elemento) => {
    chrome.runtime.sendMessage({
      type: 'content',
      content: elemento.outerHTML,
    });
  });

  
}
}
