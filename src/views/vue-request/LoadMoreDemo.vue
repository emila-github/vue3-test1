<script setup lang="ts">
import { ref } from 'vue'
import { useLoadMore } from 'vue-request'
import { get } from '@/api/request'

interface Article {
  id: number
  title: string
  summary: string
  author: string
  createdAt: string
}

interface ArticlePage {
  list: Article[]
  total: number
  currentPage: number
  totalPages: number
}

const sentinel = ref<HTMLDivElement>()

const {
  dataList,
  loading,
  loadingMore,
  noMore,
  loadMore,
  refresh,
} = useLoadMore<ArticlePage>(
  (lastData) => {
    const page = lastData?.currentPage != null ? lastData.currentPage + 1 : 1
    return get('/vr/demo/articles', { page, pageSize: 8 })
  },
  {
    isNoMore: (d) => {
      if (!d) return false
      return d.currentPage >= d.totalPages
    },
    throttleInterval: 500,
  },
)

// 滚动到可视区自动加载
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting && !loadingMore.value && !noMore.value && !loading.value) {
      loadMore()
    }
  },
  { threshold: 0.1 },
)

function setupObserver(el: HTMLDivElement | undefined) {
  sentinel.value = el
  if (el) observer.observe(el)
  else observer.disconnect()
}
</script>

<template>
  <div class="load-more-demo">
    <a-page-header title="③ 加载更多 (useLoadMore)" @back="() => $router.push('/vue-request')">
      <template #extra>
        <a-button size="small" @click="refresh()">刷新重置</a-button>
      </template>
    </a-page-header>

    <a-card size="small">
      <a-spin :spinning="loading">
        <a-list :data-source="dataList" size="small">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta :title="item.title" :description="item.summary">
                <template #avatar>
                  <a-avatar style="background:#1890ff">
                    {{ item.id }}
                  </a-avatar>
                </template>
              </a-list-item-meta>
              <template #extra>
                <span style="font-size:12px;color:#999">{{ item.createdAt.slice(0, 10) }}</span>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </a-spin>

      <!-- 加载状态区 -->
      <div
        :ref="setupObserver"
        style="text-align:center;padding:20px;color:#999;font-size:14px"
      >
        <a-spin v-if="loadingMore" size="small" />
        <span v-else-if="loadingMore">加载中...</span>
        <span v-else-if="noMore" style="color:#bbb">
          — 已加载全部 {{ dataList.length }} 条，没有更多了 —
        </span>
        <a-button v-else type="link" @click="loadMore()">
          点击加载更多
        </a-button>
      </div>

      <div class="code-hint">
        <p><b>核心要点：</b></p>
        <ul>
          <li><code>dataList</code> 是 ComputedRef，自动合并所有页的 list</li>
          <li><code>noMore</code> 由 <code>isNoMore</code> 函数判定何时停止加载</li>
          <li>searvice 接收上次返回的完整 data，计算下一页参数</li>
          <li>配合 <code>IntersectionObserver</code> + <code>throttleInterval</code> 实现滚动触发</li>
        </ul>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
.load-more-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px 40px;
}

.code-hint {
  margin-top: 16px;
  padding: 10px 14px;
  background: #f6f8fa;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  line-height: 1.7;
}

.code-hint ul {
  margin: 4px 0 0;
  padding-left: 18px;
}

.code-hint code {
  background: #e8e8e8;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
  color: #d63384;
}
</style>
