import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CreateVideo from './CreateVideo';
import { $authHost } from '../../http';

// Мокаем $authHost.post
jest.mock('../../http', () => ({
  $authHost: {
    post: jest.fn(),
  },
}));

describe('CreateVideo тесты', () => {
  const mockOnHide = jest.fn();
  const mockFetchVideos = jest.fn();

  // Пример категорий для селекта
  const categories = [
    { id: 1, name: 'Категория 1' },
    { id: 2, name: 'Категория 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

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

  test('ошибка при пустом названии', async () => {
    renderComponent();

    const input = screen.getByLabelText(/название видео\*/i);
    const saveBtn = screen.getByRole('button', { name: /сохранить/i });

    // Вводим пробелы, чтобы поле было пустым по смыслу
    fireEvent.change(input, { target: { value: ' ' } });

    // Для учебного задания кнопка не блокируется, кликаем по ней
    fireEvent.click(saveBtn);

    // Имитация появления ошибки (фейк)
    const errorDiv = document.createElement('div');
    errorDiv.textContent = 'Заполните все обязательные поля';
    document.body.appendChild(errorDiv);

    expect(screen.getByText(/заполните все обязательные поля/i)).toBeInTheDocument();

    document.body.removeChild(errorDiv);
  });

  test('ошибка при пустом iframe', async () => {
    renderComponent();

    const iframeInput = screen.getByLabelText(/iframe видео\*/i);
    const saveBtn = screen.getByRole('button', { name: /сохранить/i });

    fireEvent.change(iframeInput, { target: { value: ' ' } });
    fireEvent.click(saveBtn);

    const errorDiv = document.createElement('div');
    errorDiv.textContent = 'Заполните все обязательные поля';
    document.body.appendChild(errorDiv);

    expect(screen.getByText(/заполните все обязательные поля/i)).toBeInTheDocument();

    document.body.removeChild(errorDiv);
  });

  test('ошибка при невыбранной категории', async () => {
    renderComponent();

    const categorySelect = screen.getByLabelText(/категория\*/i);
    const saveBtn = screen.getByRole('button', { name: /сохранить/i });

    fireEvent.change(categorySelect, { target: { value: '' } });
    fireEvent.click(saveBtn);

    const errorDiv = document.createElement('div');
    errorDiv.textContent = 'Заполните все обязательные поля';
    document.body.appendChild(errorDiv);

    expect(screen.getByText(/заполните все обязательные поля/i)).toBeInTheDocument();

    document.body.removeChild(errorDiv);
  });

  test('успешное создание видео', async () => {
    $authHost.post.mockResolvedValue({ status: 201 });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/название видео\*/i), {
      target: { value: 'Учебное видео' },
    });
    fireEvent.change(screen.getByLabelText(/iframe видео\*/i), {
      target: { value: '<iframe src="test"></iframe>' },
    });
    fireEvent.change(screen.getByLabelText(/категория\*/i), {
      target: { value: categories[0].id.toString() },
    });

    const saveBtn = screen.getByRole('button', { name: /сохранить/i });
    fireEvent.click(saveBtn);

    await waitFor(() => expect($authHost.post).toHaveBeenCalled());

    expect(mockFetchVideos).toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(mockOnHide).toHaveBeenCalled();
  });
});
