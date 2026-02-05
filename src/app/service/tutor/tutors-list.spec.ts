import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TutorsListService, TutorResponse } from './tutors-list';
import { environment } from '../../../environments/environment';
describe('TutorsListService', () => {
  let service: TutorsListService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TutorsListService]
    });

    service = TestBed.inject(TutorsListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado corretamente', () => {
    expect(service).toBeTruthy();
  });

  it('deve chamar a API com parâmetros de paginação padrão (0 e 10)', () => {
    service.execute().subscribe();

    const req = httpMock.expectOne(request =>
      request.url === `${environment.api_url}/tutores` &&
      request.params.get('page') === '0' &&
      request.params.get('size') === '10'
    );

    expect(req.request.method).toBe('GET');
    req.flush({ content: [], total: 0 });
  });

  it('deve incluir o parâmetro de busca por nome quando fornecido', () => {
    const nomeBusca = 'Joana';
    service.execute(1, 20, nomeBusca).subscribe();

    const req = httpMock.expectOne(request =>
      request.params.get('nome') === nomeBusca &&
      request.params.get('page') === '1' &&
      request.params.get('size') === '20'
    );

    expect(req.request.method).toBe('GET');
    req.flush({ content: [], total: 0 });
  });

  it('deve retornar a estrutura correta de TutorResponse', () => {
    const mockResponse: TutorResponse = {
      page: 0,
      size: 10,
      total: 1,
      pageCount: 1,
      content: [
        {
          id: 1,
          nome: 'Joana Fernandes',
          email: 'Joana@email.com',
          telefone: '6599999999',
          endereco: 'Várzea Grande, MT',
          cpf: 12345678901,
          foto: { id: 10, nome: 'foto.jpg', url: 'http://api.com/foto.jpg' }
        }
      ]
    };

    service.execute().subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(res.content.length).toBe(1);
      expect(res.content[0].nome).toBe('Joana Fernandes');
    });

    const req = httpMock.expectOne(req => req.url.includes('/tutores'));
    req.flush(mockResponse);
  });
});
