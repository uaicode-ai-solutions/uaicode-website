-- Delete messages from orphan conversations (only with initial message)
DELETE FROM chat_messages 
WHERE conversation_id IN (
  SELECT c.id 
  FROM chat_conversations c
  WHERE (SELECT COUNT(*) FROM chat_messages m WHERE m.conversation_id = c.id) <= 1
);

-- Delete orphan conversations (no messages)
DELETE FROM chat_conversations 
WHERE id NOT IN (SELECT DISTINCT conversation_id FROM chat_messages);