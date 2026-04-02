---
applyTo: ".js,.jsx"
---

#### Standardy pisania kodu
1. Zawsze używaj camelCase do nazw funkcji i UpperCamelCase to nazw komponentów, używaj nazw w języku angielskim
2. Zawsze eksportuj funckje jako arrow function z return, a nie jako one-liner.
3. Nigdy nie dodawaj komentarzy nad utworzoną funkcją
4. Twórz pliki z funkcjami w folderze odpowiadającego im komponentu i z sufixem 'Utils', np Sidebar/Sidebar.jsx, Sidebar/sidebarUtils.js. Używaj camelCase do nazw tych plików.
5. Zawsze skupiaj się na jednym podanym zadaniu. Zapytaj mnie, jeśli chcesz wykonać dodatkowe akcje.


Pobieram strukturę bazy danych z Supabase — kolumny, typy, klucze obce i tabele public.

Uruchomiono Execute SQL
Completed with input: {
  "project_id": "ohfoucrhlvnihhdnbadb",
  "query": "select\n  c.table_name,\n  c.column_name,\n  c.data_type,\n  c.is_nullable,\n  c.column_default,\n  kcu.constraint_name,\n  ccu.table_name as foreign_table,\n  ccu.column_name as foreign_column\nfrom information_schema.columns c\nleft join information_schema.key_column_usage kcu\n  on kcu.table_schema = c.table_schema\n  and kcu.table_name = c.table_name\n  and kcu.column_name = c.column_name\nleft join information_schema.referential_constraints rc\n  on rc.constraint_name = kcu.constraint_name\nleft join information_schema.constraint_column_usage ccu\n  on ccu.constraint_name = rc.unique_constraint_name\nwhere c.table_schema = 'public'\norder by c.table_name, c.ordinal_position;"
}

#### Struktura bazy danych Supabase

**public.notes**
- id: uuid PK
- created_at: timestamptz
- updated_at: timestamptz
- user_id: uuid FK → auth.users(id)
- title: text
- content: json
- tag: text
- plainTextContent: text

**public.files**
- id: uuid PK
- created_at: timestamptz
- user_id: uuid FK → auth.users(id)
- note_id: uuid FK → public.notes(id)
- file_name: text
- file_path: text  (format: {user_id}/{file_name})
- file_size: bigint
- content_type: text

#### **Instrukcje Code Review**

**Obszary do sprawdzania:**
* **Performance** – Re-rendery, memoizacja, optymalizacja
* **Clean Code** – Czytelność, możliwość utrzymania, wzorce

**Format odpowiedzi:**
* **Opis problemu** z poziomem ważności
* **Wyjaśnienie** dlaczego to ważne
* **Sposób naprawy**
