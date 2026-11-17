import { ApiError } from './api-error';
import { errorEnvelope, exampleAsset, successEnvelope } from './testing/envelopes';
import { unwrapEnvelope } from './unwrap-envelope';

describe('unwrapEnvelope', () => {
  it('devolve o data do envelope de sucesso', () => {
    // Arrange
    const asset = exampleAsset();

    // Act
    const result = unwrapEnvelope(successEnvelope(asset), 200);

    // Assert
    expect(result).toEqual(asset);
  });

  it('devolve null quando o corpo é nulo ou vazio (204)', () => {
    // Arrange
    const bodies = [null, undefined, ''];

    // Act
    const results = bodies.map((body) => unwrapEnvelope(body, 204));

    // Assert
    expect(results).toEqual([null, null, null]);
  });

  it('lança ApiError genérico com o status real quando um 2xx traz success falso', () => {
    // Arrange
    const body = errorEnvelope(400, 'Título possui aportes e não pode ser removido.');

    // Act
    let error: unknown;
    try {
      unwrapEnvelope(body, 200);
    } catch (thrown) {
      error = thrown;
    }

    // Assert
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 200, message: 'Ocorreu um erro inesperado. Tente novamente mais tarde.' });
  });
});
