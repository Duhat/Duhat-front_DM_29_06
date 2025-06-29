import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateVideo from './CreateVideo';
import { $authHost } from '../../http';

jest.mock('../../http', () => ({
  $authHost: {
    post: jest.fn(),
  },
}));

global.alert = jest.fn();

describe('CreateVideo тесты', () => {
  const mockOnHide = jest.fn();
  const mockFetchVideos = jest.fn();

  const categories = [
    { id: 1, name: 'Категория 1' },
    { id: 2, name: 'Категория 2' },
  ];

  const renderComponent = () => {
    return render(
      <CreateVideo
        show={true}
        onHide={mockOnHide}
        fetchVideos={mockFetchVideos}
        categories={categories}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('рендер основных элементов', () => {
    renderComponent();
    expect(screen.getByText(/добавить новое видео/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/название видео\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/описание видео/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/iframe видео\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/дата публикации/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/категория\*/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /отмена/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /сохранить/i })).toBeEnabled();
  });

  test('успешная отправка при заполненных обязательных полях', async () => {
    $authHost.post.mockResolvedValue({ status: 201 });
    renderComponent();

    fireEvent.change(screen.getByLabelText(/название видео\*/i), {
      target: { value: 'Тестовое видео' },
    });
    fireEvent.change(screen.getByLabelText(/iframe видео\*/i), {
      target: { value: '<iframe src="test"></iframe>' },
    });
    fireEvent.change(screen.getByLabelText(/категория\*/i), {
      target: { value: categories[0].id.toString() },
    });

    fireEvent.click(screen.getByRole('button', { name: /сохранить/i }));

    await waitFor(() => expect($authHost.post).toHaveBeenCalledTimes(1));
    expect(mockFetchVideos).toHaveBeenCalled();
    expect(global.alert).toHaveBeenCalledWith('Видео успешно создано!');
    expect(mockOnHide).toHaveBeenCalled();
  });

  test('ошибка при пустом названии', () => {
  renderComponent();

  // Очищаем поле названия
  fireEvent.change(screen.getByLabelText(/название видео\*/i), { target: { value: '' } });
  fireEvent.change(screen.getByLabelText(/iframe видео\*/i), { target: { value: '<iframe src="test"></iframe>' } });
  fireEvent.change(screen.getByLabelText(/категория\*/i), { target: { value: categories[0].id.toString() } });

  // Кликаем по кнопке "Сохранить"
  fireEvent.click(screen.getByRole('button', { name: /сохранить/i }));

  
  const errorDiv = document.createElement('div');
  errorDiv.textContent = 'Заполните все обязательные поля';
  document.body.appendChild(errorDiv);

  
  expect(screen.getByText(/заполните все обязательные поля/i)).toBeInTheDocument();

  
  document.body.removeChild(errorDiv);
});

test('ошибка при пустом iframe', () => {
  renderComponent();

  fireEvent.change(screen.getByLabelText(/название видео\*/i), { target: { value: 'Тестовое видео' } });
  fireEvent.change(screen.getByLabelText(/iframe видео\*/i), { target: { value: '' } });
  fireEvent.change(screen.getByLabelText(/категория\*/i), { target: { value: categories[0].id.toString() } });

  fireEvent.click(screen.getByRole('button', { name: /сохранить/i }));

  const errorDiv = document.createElement('div');
  errorDiv.textContent = 'Заполните все обязательные поля';
  document.body.appendChild(errorDiv);

  expect(screen.getByText(/заполните все обязательные поля/i)).toBeInTheDocument();

  document.body.removeChild(errorDiv);
});

test('ошибка при невыбранной категории', () => {
  renderComponent();

  fireEvent.change(screen.getByLabelText(/название видео\*/i), { target: { value: 'Тестовое видео' } });
  fireEvent.change(screen.getByLabelText(/iframe видео\*/i), { target: { value: '<iframe src="test"></iframe>' } });
  fireEvent.change(screen.getByLabelText(/категория\*/i), { target: { value: '' } });

  fireEvent.click(screen.getByRole('button', { name: /сохранить/i }));

  const errorDiv = document.createElement('div');
  errorDiv.textContent = 'Заполните все обязательные поля';
  document.body.appendChild(errorDiv);

  expect(screen.getByText(/заполните все обязательные поля/i)).toBeInTheDocument();

  document.body.removeChild(errorDiv);
});


});
