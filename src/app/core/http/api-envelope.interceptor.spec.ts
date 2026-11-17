import { HttpClient, httpResource, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ApiError } from './api-error';
import { apiEnvelopeInterceptor } from './api-envelope.interceptor';
import { errorEnvelope, exampleAsset, successEnvelope } from './testing/envelopes';

const CONNECTION_MESSAGE = 'Não foi possível conectar ao servidor. Verifique sua conexão e tente de novo.';
const GENERIC_MESSAGE = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
const ASSET_ID = '24e7dc84-5fd4-4f14-91de-7a2e4156cade';
const ASSET_URL = `/api/Assets/${ASSET_ID}`;

describe('apiEnvelopeInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([apiEnvelopeInterceptor])), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /** Espera a requisição terminar e devolve o erro entregue ao chamador; falha se não houve erro. */
  async function captureError(result: Promise<unknown>): Promise<unknown> {
    try {
      await result;
    } catch (error) {
      return error;
    }
    throw new Error('A requisição deveria ter falhado.');
  }

  it('devolve o data quando a API responde 200 com envelope de sucesso', async () => {
    // Arrange
    const asset = exampleAsset();
    const result = firstValueFrom(http.get(ASSET_URL));

    // Act
    httpMock.expectOne(ASSET_URL).flush(successEnvelope(asset));

    // Assert
    expect(await result).toEqual(asset);
  });

  it('devolve o data quando a API responde 201', async () => {
    // Arrange
    const asset = exampleAsset();
    const result = firstValueFrom(http.post('/api/Assets', { name: asset.name }));

    // Act
    httpMock.expectOne('/api/Assets').flush(successEnvelope(asset, 201), { status: 201, statusText: 'Created' });

    // Assert
    expect(await result).toEqual(asset);
  });

  it('devolve vazio, sem erro, quando a API responde 204 sem corpo', async () => {
    // Arrange
    const result = firstValueFrom(http.delete(ASSET_URL));

    // Act
    httpMock.expectOne(ASSET_URL).flush(null, { status: 204, statusText: 'No Content' });

    // Assert
    expect(await result).toBeNull();
  });

  it('entrega um ApiError com status 400 e a mensagem da API quando a API responde 400', async () => {
    // Arrange
    const message = 'Título possui aportes e não pode ser removido.';
    const result = firstValueFrom(http.delete(ASSET_URL));

    // Act
    httpMock.expectOne(ASSET_URL).flush(errorEnvelope(400, message), { status: 400, statusText: 'Bad Request' });
    const error = await captureError(result);

    // Assert
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 400, message });
  });

  it('entrega um ApiError com status 404 e a mensagem da API quando a API responde 404', async () => {
    // Arrange
    const message = `Título com id ${ASSET_ID} não encontrado.`;
    const result = firstValueFrom(http.get(ASSET_URL));

    // Act
    httpMock.expectOne(ASSET_URL).flush(errorEnvelope(404, message), { status: 404, statusText: 'Not Found' });
    const error = await captureError(result);

    // Assert
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, message });
  });

  it('entrega a mensagem genérica, sem o texto do corpo, quando a API responde 500', async () => {
    // Arrange
    const bodyText = 'Ocorreu um erro interno. Tente novamente mais tarde.';
    const result = firstValueFrom(http.get('/api/Assets'));

    // Act
    httpMock
      .expectOne('/api/Assets')
      .flush(errorEnvelope(500, bodyText), { status: 500, statusText: 'Internal Server Error' });
    const error = await captureError(result);

    // Assert
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 500, message: GENERIC_MESSAGE });
    expect((error as ApiError).message).not.toContain(bodyText);
  });

  it('entrega a mensagem de conexão, com status 0, quando não há resposta', async () => {
    // Arrange
    const result = firstValueFrom(http.get('/api/Assets'));

    // Act
    httpMock.expectOne('/api/Assets').error(new ProgressEvent('error'));
    const error = await captureError(result);

    // Assert
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 0, message: CONNECTION_MESSAGE });
  });

  it('entrega a mensagem genérica quando um 4xx chega sem envelope', async () => {
    // Arrange
    const result = firstValueFrom(http.get('/api/Assets'));

    // Act
    httpMock
      .expectOne('/api/Assets')
      .flush('<html><body>404 Not Found</body></html>', { status: 404, statusText: 'Not Found' });
    const error = await captureError(result);

    // Assert
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, message: GENERIC_MESSAGE });
  });

  it('não mexe em resposta fora de /api/', async () => {
    // Arrange
    const result = firstValueFrom(http.get('/health', { responseType: 'text' }));

    // Act
    httpMock.expectOne('/health').flush('Healthy');

    // Assert
    expect(await result).toBe('Healthy');
  });

  it('entrega a mensagem genérica, com o status 200, quando a API responde 200 com um corpo fora do envelope', async () => {
    // Arrange
    const result = firstValueFrom(http.get('/api/Assets'));

    // Act
    httpMock.expectOne('/api/Assets').flush({ id: ASSET_ID, name: 'sem envelope' });
    const error = await captureError(result);

    // Assert
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 200, message: GENERIC_MESSAGE });
  });

  it('entrega a mensagem genérica quando um 4xx chega com envelope sem message', async () => {
    // Arrange
    const result = firstValueFrom(http.get('/api/Assets'));

    // Act
    httpMock
      .expectOne('/api/Assets')
      .flush(
        { statusCode: 400, success: false, message: null, data: null },
        { status: 400, statusText: 'Bad Request' },
      );
    const error = await captureError(result);

    // Assert
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 400, message: GENERIC_MESSAGE });
  });

  it.each([
    { status: 502, statusText: 'Bad Gateway' },
    { status: 503, statusText: 'Service Unavailable' },
    { status: 504, statusText: 'Gateway Timeout' },
  ])(
    'entrega a mensagem de conexão, com o status real, quando o proxy responde $status sem envelope',
    async ({ status, statusText }) => {
      // Arrange
      const result = firstValueFrom(http.get('/api/Assets'));

      // Act
      httpMock.expectOne('/api/Assets').flush('<html><body>proxy</body></html>', { status, statusText });
      const error = await captureError(result);

      // Assert
      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({ status, message: CONNECTION_MESSAGE });
    },
  );

  it('entrega o value() de um httpResource já desembrulhado', async () => {
    // Arrange
    const asset = exampleAsset();
    const resource = TestBed.runInInjectionContext(() => httpResource(() => ASSET_URL));
    TestBed.tick();

    // Act
    httpMock.expectOne(ASSET_URL).flush(successEnvelope(asset));
    await TestBed.inject(ApplicationRef).whenStable();

    // Assert
    expect(resource.value()).toEqual(asset);
  });

  it('entrega o error() de um httpResource como ApiError com a mensagem da API quando ela responde 400', async () => {
    // Arrange
    const message = 'Título possui aportes e não pode ser removido.';
    const resource = TestBed.runInInjectionContext(() => httpResource(() => ASSET_URL));
    TestBed.tick();

    // Act
    httpMock.expectOne(ASSET_URL).flush(errorEnvelope(400, message), { status: 400, statusText: 'Bad Request' });
    await TestBed.inject(ApplicationRef).whenStable();

    // Assert
    expect(resource.error()).toBeInstanceOf(ApiError);
    expect(resource.error()).toMatchObject({ status: 400, message });
  });
});
