import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    // 通过RPC函数创建news表
    const { error: rpcError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS news (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          author_id UUID REFERENCES users(id),
          status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
          published_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          metadata JSONB DEFAULT '{}'
        );

        CREATE INDEX IF NOT EXISTS idx_news_author_id ON news(author_id);
        CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
        CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at);
        CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);

        CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 
      `
    });
    
    if (rpcError) {
      console.error('创建news表失败:', rpcError);
      return NextResponse.json(
        { error: '创建news表失败', details: rpcError.message }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'news表创建成功' 
    });

  } catch (error) {
    console.error('创建news表失败:', error);
    return NextResponse.json(
      { error: '创建news表失败', details: error instanceof Error ? error.message : '未知错误' }, 
      { status: 500 }
    );
  }
} 