import { renderHook, act } from "@testing-library/react-hooks";
import useTasks from "../index";

test("Premier Test : Test pour vérifier le chargement des tâches depuis le local storage", () => {
  // Simulez des tâches stockées dans le local storage (comme une chaîne JSON).
  const storedTasks = JSON.stringify([
    { id: 1, text: "Tâche 1", completed: false },
    { id: 2, text: "Tâche 2", completed: true },
  ]);

  // Utilisez localStorage.setItem pour simuler le stockage des tâches.
  const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
  setItemSpy.mockImplementation((key, value) => {
    if (key === "tasks") {
      expect(value).toEqual(storedTasks);
    }
  });

  const { result } = renderHook(() => useTasks());

  // Les tâches initiales devraient correspondre aux tâches stockées dans le local storage.
  expect(result.current.tasks).toEqual(JSON.parse(storedTasks));

  setItemSpy.mockRestore(); // Restaurer le comportement original de localStorage.setItem.
});

test("Deuxième Test: Test pour vérifier l'ajout d'une nouvelle tâche", () => {
  const { result } = renderHook(() => useTasks());

  // Ajoutez une nouvelle tâche.
  act(() => {
    result.current.addTask("Nouvelle tâche");
  });

  // Vérifiez que la nouvelle tâche a été ajoutée.
  expect(result.current.tasks.length).toBe(1);
  expect(result.current.tasks[0].text).toBe("Nouvelle tâche");
  expect(result.current.tasks[0].completed).toBe(false);
});

test("Troisième Test: Test pour basculer l'état d'une tâche", () => {
  const { result } = renderHook(() => useTasks());

  // Ajoutez une tâche.
  act(() => {
    result.current.addTask("Tâche à basculer");
  });

  const taskId = result.current.tasks[0].id;

  // Basculez l'état de la tâche.
  act(() => {
    result.current.toggleTask(taskId);
  });

  // Vérifiez que l'état de la tâche a été basculé.
  expect(result.current.tasks[0].completed).toBe(true);
});

test("Quatrième Test : Test pour supprimer une tâche", () => {
  const { result } = renderHook(() => useTasks());

  // Ajoutez une tâche.
  act(() => {
    result.current.addTask("Tâche à supprimer");
  });

  const taskId = result.current.tasks[0].id;

  // Supprimez la tâche.
  act(() => {
    result.current.deleteTask(taskId);
  });

  // Vérifiez que la tâche a été supprimée.
  expect(result.current.tasks.length).toBe(0);
});
