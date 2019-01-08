
import { buildModeUrl } from './signModeUrl';

describe('#buildModelUrl', () => {
  test('it should be a function', () => {
    expect(typeof buildModeUrl).toBe('function');
  });

  test('it should return the proper URL', () => {
    const reportUrl = buildModeUrl({
      accessKey: 'abc',
      reportId: 'b077e775f66a',
      parameters: {
        start_date: '2017-10-01',
        account_name: '123',
        end_date: '2019-10-01',
      },
    });

    expect(reportUrl).toBe('https://modeanalytics.com/carecru/reports/b077e775f66a/embed?access_key=abc&max_age=1600&param_account_name=123&param_end_date=2019-10-01&param_start_date=2017-10-01');
  });
});
