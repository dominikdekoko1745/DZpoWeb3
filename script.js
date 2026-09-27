const form = document.getElementById("checkForm");
const result = document.getElementById("result");

const API_URL = "https://inai-col1.fishrungames.com";

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const studentId = document.getElementById("studentId").value;
    const buildingNumber = document.getElementById("buildingNumber").value;
    const roomNumber = document.getElementById("roomNumber").value;

    result.className = "result";
    result.style.display = "block";
    result.textContent = "Проверяем...";

    try {

        // Получаем информацию о студенте
        const studentResponse = await fetch(
            `${API_URL}/students/${studentId}`
        );

        if (!studentResponse.ok) {
            throw new Error("Студент не найден");
        }

        const student = await studentResponse.json();


        // Получаем информацию о корпусе
        const buildingResponse = await fetch(
            `${API_URL}/buildings/${buildingNumber}`
        );

        if (!buildingResponse.ok) {
            throw new Error("Корпус не найден");
        }

        const building = await buildingResponse.json();


        // Получаем информацию о комнате
        const roomResponse = await fetch(
            `${API_URL}/rooms/${roomNumber}`
        );

        if (!roomResponse.ok) {
            throw new Error("Комната не найдена");
        }

        const room = await roomResponse.json();


        // Проверяем условия

        const studentIsResident = student.resident;
        const buildingForStudents = building.forStudents;
        const roomIsAvailable = room.available;


        // Если все условия выполнены
        if (
            studentIsResident &&
            buildingForStudents &&
            roomIsAvailable
        ) {

            result.className = "result success";

            result.innerHTML = `
                <strong>Заселение разрешено!</strong>

                <div class="check">
                    ✓ Студент является иногородним
                </div>

                <div class="check">
                    ✓ Корпус предназначен для студентов
                </div>

                <div class="check">
                    ✓ Комната свободна
                </div>
            `;

        } else {

            result.className = "result error";

            let message = "<strong>В заселении отказано.</strong>";

            if (!studentIsResident) {
                message += `
                    <div class="check">
                        ✗ Студент не является иногородним
                    </div>
                `;
            }

            if (!buildingForStudents) {
                message += `
                    <div class="check">
                        ✗ Корпус не предназначен для студентов
                    </div>
                `;
            }

            if (!roomIsAvailable) {
                message += `
                    <div class="check">
                        ✗ Комната занята
                    </div>
                `;
            }
            result.innerHTML = message;
        }

    } catch (error) {
        result.className = "result error";

        result.innerHTML = `
            <strong>Ошибка:</strong>
            <div class="check">${error.message}</div>
        `;
    }
});
