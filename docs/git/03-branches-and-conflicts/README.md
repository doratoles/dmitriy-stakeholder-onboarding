# Використані команди

git switch -c learn/STU-240-branches-conflicts
git switch -c learn/STU-240-branches-conflicts-alternative
git merge learn/STU-240-branches-conflicts-alternative
git log --graph --oneline --all
git grep -n '<<<<<<<\|=======\|>>>>>>>' -- .

# Причина виникнення конфлікту

Конфлікт виник у файлі conflict-demo.md у другому рядку. В обох гілках (learn/STU-240-branches-conflicts та 
learn/STU-240-branches-conflicts-alternative), які мають спільний базовий коміт, один і той самий рядок було 
змінено по-різному без прямого зв'язку:
- В одній гілці рядок став: Status: ready for mentor review
- В іншій: Status: reviewed by teammate
Git не зміг автоматично визначити, яка зміна має пріоритет

# Пояснення Conflict Markers

- <<<<<<< HEAD — позначає початок змін з поточної гілки, у яку виконується злиття (learn/STU-240-branches-conflicts).
- ======= — роздільник між двома конфліктуючими версіями.
- >>>>>>> learn/STU-240-branches-conflicts-alternative — завершення блоку змін з гілки, яка зливається.

# Опис прийнятого рішення

Oбидва статуси було об'єднано в один логічний результат: reviewed by teammate and readiness for mentor review.