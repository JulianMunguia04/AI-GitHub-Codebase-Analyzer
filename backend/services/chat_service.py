from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def ask_repository(question, chunks):
  context = ""

  for path, content in chunks:

      context += f"""

  FILE:
  {path}

  CONTENT:
  {content}

  """
  
  response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "system",
            "content": "You are an expert software engineer. Answer only using the provided repository context. Return a JSON object with reponse: (this response should be a string that contains a md markdown with code snippets and filepaths in code snippets so users know where the code is from also add notes in the appropriate language to the code snippets, also indicate the filepath to this code snippet), as  well as routes: [array of files paths that the user can reference]"
        },
        {
            "role": "user",
            "content": f"Repository Context: {context}\n\nQuestion: {question}"
        }
    ]
  )

  return response.choices[0].message.content