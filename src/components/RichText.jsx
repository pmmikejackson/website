export default function RichText({ blocks, theme }) {
  if (!blocks) return null

  return (
    <div style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
      {blocks.map((block, i) => {
        if (block.type === 'paragraph') {
          return (
            <p key={i} style={{ marginBottom: '1rem' }}>
              {renderChildren(block.children, theme)}
            </p>
          )
        }
        if (block.type === 'heading') {
          const Tag = `h${block.level || 2}`
          return (
            <Tag key={i} style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              {renderChildren(block.children, theme)}
            </Tag>
          )
        }
        if (block.type === 'list') {
          const Tag = block.format === 'ordered' ? 'ol' : 'ul'
          return (
            <Tag key={i} style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
              {block.children?.map((li, j) => (
                <li key={j} style={{ marginBottom: '0.25rem' }}>
                  {renderChildren(li.children, theme)}
                </li>
              ))}
            </Tag>
          )
        }
        if (block.type === 'quote') {
          return (
            <blockquote key={i} style={{
              borderLeft: `3px solid ${theme.accent}`,
              paddingLeft: '1rem',
              margin: '1rem 0',
              color: theme.muted,
              fontStyle: 'italic',
            }}>
              {renderChildren(block.children, theme)}
            </blockquote>
          )
        }
        if (block.type === 'code') {
          return (
            <pre key={i} style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              padding: '1rem',
              overflow: 'auto',
              marginBottom: '1rem',
              fontSize: '0.9rem',
            }}>
              <code>{block.children?.[0]?.text}</code>
            </pre>
          )
        }
        if (block.type === 'image') {
          return (
            <img
              key={i}
              src={block.image?.url}
              alt={block.image?.alternativeText || ''}
              style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '1rem' }}
            />
          )
        }
        return null
      })}
    </div>
  )
}

function renderChildren(children, theme) {
  if (!children) return null
  return children.map((child, j) => {
    if (child.type === 'link') {
      return (
        <a key={j} href={child.url} style={{ color: theme.accent }} target="_blank" rel="noreferrer">
          {child.children?.map((c, k) => renderChild(c, k))}
        </a>
      )
    }
    return renderChild(child, j)
  })
}

function renderChild(child, key) {
  let content = child.text
  if (child.code) return <code key={key} style={{ fontSize: '0.9em', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>{content}</code>
  if (child.bold) content = <strong key={key}>{content}</strong>
  if (child.italic) content = <em key={key}>{content}</em>
  if (child.strikethrough) content = <s key={key}>{content}</s>
  if (typeof content === 'string') return <span key={key}>{content}</span>
  return content
}
